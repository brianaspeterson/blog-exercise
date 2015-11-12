var API = require('./api'),
    Post = require('./Post'),
    _ = require('lodash');



var ViewController = function(model) {
  this.model = model;
  this.postCollection = [];
  this.undoArray = [];
  this.arrayIndex = [];
  this.localStoreArray = [];
  var postTemplate = document.getElementById('blog-post-template');
  this.template = _.template(postTemplate.textContent.trim());
  this.initialize();
};

if (typeof window.addEventListener === 'undefined') {
    window.addEventListener = function(e, callback) {
        return window.attachEvent('on' + e, callback);
    }
}

window.addEventListener('beforeunload', function() {

  this.localStoreArray.forEach(function(data){
    API.removePost(data);

  });
});

ViewController.prototype.initialize = function() {
  this.establishHandlers();
  this.fetchPosts();
  var elements = this.generatePostDOMElements(this.postCollection);
  this.renderPosts(elements);

}

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
  })

  document.getElementsByClassName('blog-body-undo-post')[0]
  .addEventListener('click', function(e) {
    e.preventDefault();
    that.handleUndo();
  })


}

ViewController.prototype.handleUndo = function(){

  var oldPost = this.undoArray.shift();
  var oldIndex = this.arrayIndex.shift();
  var removeLocalStorage = this.arrayIndex.shift();
  this.postCollection.splice(oldIndex, 0, oldPost);
  var elements = this.generatePostDOMElements([oldPost[0]]);
  this.renderUndoPost(elements, oldIndex);
  //need index so that i can say splice 

};

ViewController.prototype.renderUndoPost = function(postDOMElement, index){
     var parent = document.getElementsByClassName('blog-body__content')[0];
     parent.insertBefore(postDOMElement[0], parent.children[index]);


}

ViewController.prototype.fetchPosts = function(id) {
  if (id === undefined){
  var response = API.get();
  if (response.status === 200) {
    this.postCollection = response.body.map(function(post) {
      return new Post(JSON.parse(post));
    }).reverse();
  }
}
else {
  var response = API.get(id);
  if (response.status === 200) {
    this.postCollection = response.body.map(function(post) {
      return new Post(JSON.parse(post));
    }).reverse();
  }
}
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
  // var response = API.removePost(data);
  // if (response.status ===  200){
  this.localStoreArray.push(data);
  console.log(localStorage);
  var index = postCollection.map(function(post){ return post.attributes.id  }).indexOf(data);
  this.arrayIndex.push(index); 
  var deletedPost = postCollection.splice(index, 1);
  this.undoArray.push(deletedPost);
  console.log(postCollection);
  this.removeFromUI();
  // }
  // else{
  //   console.log("Didnt get removed");
  // }

  // body...
};

ViewController.prototype.removeFromUI = function(){
  var curBlogPost = document.activeElement.parentElement;
  curBlogPost.parentNode.removeChild(curBlogPost);
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
  }

  var elements = this.generatePostDOMElements([postModel]);
  this.renderPost(elements[0]);
}


module.exports = ViewController;
