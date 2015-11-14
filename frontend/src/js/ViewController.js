var API = require('./api'),
    Post = require('./Post'),
    _ = require('lodash');


var ViewController = function(model) {
    this.model = model;
    this.postCollection = [];
    this.undoArray = [];
    this.arrayIndex = [];
    this.blogPost = [];
    this.submitType = [];
    this.postBlog = [];
    this.dataAddArray = [];
    var postTemplate = document.getElementById('blog-post-template');
    this.template = _.template(postTemplate.textContent.trim());
    this.initialize();
};

ViewController.prototype.establishDeleteHandlers = function(button, post) {
    var that = this;
    button.addEventListener('click', function(e) {
        e.preventDefault();
        var curId = this.attributes.id;

        that.handleDelete(curId);


    }.bind(post));
};

ViewController.prototype.initialize = function() {
    this.establishHandlers();
    this.fetchPosts();
    var elements = this.generatePostDOMElements(this.postCollection);
    this.renderPosts(elements);

};

ViewController.prototype.establishHandlers = function() {
    var that = this;
    document.getElementsByClassName('blog-body__form-section__form__submit')[0]
        .addEventListener('click', function(e) {
            e.preventDefault();
            var title = document.getElementsByClassName('blog-body__form-section__form__title')[0].value;
            var body = document.getElementsByClassName('blog-body__form-section__form__body')[0].value;
            that.handleSubmit({
                title: title,
                body: body
            });
        });



    document.getElementsByClassName('blog-body-undo-post')[0]
        .addEventListener('click', function(e) {
            e.preventDefault();
            that.handleUndo();
        });
};



ViewController.prototype.handleUndo = function() {

    var type = this.submitType.pop();


    if (type === "delete") {
        var oldPost = this.undoArray.shift();
        var oldIndex = this.arrayIndex.shift();
        var curPost = this.blogPost.shift();
        this.postCollection.splice(oldIndex, 0, oldPost);
        API.updatePost(oldPost);
        curPost.className = "blog-post";
    } else if (type === "add") {
        curPost = this.postBlog.pop();
        var dataPost = this.dataAddArray.pop();
        API.removePost(dataPost.attributes.id);
        curPost.className = "blog-post-hide";
    }


    if (this.undoArray.length <= 0 && this.postBlog.length <= 0) {
        this.hideUndo();
    }

};

ViewController.prototype.hideUndo = function() {
    document.getElementsByClassName('blog-body-undo-post')[0].id = "grey-out";

};

ViewController.prototype.renderUndoPost = function(postDOMElement, index) {
    var parent = document.getElementsByClassName('blog-body__content')[0];
    parent.insertBefore(postDOMElement[0], parent.children[index]);


};

ViewController.prototype.fetchPosts = function(id) {
    if (id === undefined) {
        var response = API.get();
        if (response.status === 200) {
            this.postCollection = response.body.map(function(post) {
                return new Post(JSON.parse(post));
            }).reverse();
        }
    } else {
        var response = API.get(id);
        if (response.status === 200) {
            this.postCollection = response.body.map(function(post) {
                return new Post(JSON.parse(post));
            }).reverse();
        }
    };
};

ViewController.prototype.establishDeleteHandlers = function(button, post) {
    var that = this;
    button.addEventListener('click', function(e) {
        e.preventDefault();
        var curId = this.attributes.id;

        that.handleDelete(curId);


    }.bind(post))
};

ViewController.prototype.handleDelete = function(data) {
    this.removePost(data);
};

ViewController.prototype.removePost = function(data) {
    var postCollection = this.postCollection;
    this.submitType.push('delete');
    var post = this.getPost(data);
    var index = postCollection.indexOf(post);
    this.arrayIndex.push(index);
    var deletedPost = postCollection.splice(index, 1);
    this.undoArray.push(post);
    if (this.undoArray) {
        this.showUndo();
    }
    this.removeFromUITemp();
    this.removeFromLocalStorage(data);

};

ViewController.prototype.removeFromLocalStorage = function(id) {

    API.removePost(id);

}

ViewController.prototype.getPost = function(postId) {
    return _.find(this.postCollection, function(post) {
        return post.attributes.id === postId;
    });
};

ViewController.prototype.removeFromUI = function() {
    var curBlogPost = document.activeElement.parentElement;
    curBlogPost.parentNode.removeChild(curBlogPost);
}

ViewController.prototype.removeFromUITemp = function() {
    console.log(localStorage);

    var curBlogPost = document.activeElement.parentElement;
    curBlogPost.className = "blog-post-hide";
    this.blogPost.push(curBlogPost);
}

ViewController.prototype.generatePostDOMElements = function(posts) {
    var that = this;
    return posts.map(function(post) {
        var html = that.template(post.attributes || post[0].attributes);
        var wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = html;
        that.establishDeleteHandlers(wrapperDiv.firstChild.lastElementChild, post);
        return wrapperDiv.firstChild;
    });
};

ViewController.prototype.renderPosts = function(postDOMElements) {
    var bodyContent = document.getElementsByClassName('blog-body__content')[0];
    postDOMElements.forEach(function(element) {
        bodyContent.appendChild(element);
    });
};

ViewController.prototype.renderPost = function(postDOMElement) {
    var parent = document.getElementsByClassName('blog-body__content')[0];
    parent.insertBefore(postDOMElement, parent.firstChild);
};

ViewController.prototype.handleSubmit = function(data) {
    this.addPost(data);
};

ViewController.prototype.addPost = function(data) {
    var postModel = new Post(data);
    var response = postModel.save();
    if (response.status === 200) {
        this.postCollection.push(postModel);
        this.submitType.push('add');
        this.dataAddArray.push(postModel);
        var elements = this.generatePostDOMElements([postModel]);
        this.renderPost(elements[0]);
        this.postBlog.push(elements[0]);
        this.showUndo();
    } else {

        alert("Post is empty");
    }
}

ViewController.prototype.showUndo = function() {
    document.getElementsByClassName('blog-body-undo-post')[0].id = "";

}

module.exports = ViewController;