

Playing around with Chairnerd
===

Chairnerd is built with Webpack. To get it up and running, ensure that you have `node` and `npm` available on your machine, and then run `npm install` from the root. Next, run `node_modules/webpack/bin/webpack.js` (or `webpack` if you have it installed globally) to build Chairnerd from source. Finally, launch a local server running on `localhost` and serving the root directory to view Chairnerd!

Note that the data you store in Chairnerd is designed to persist across multiple sessions. Add a post and refresh the page to see this in action.


Tasks
===

Chairnerd is in a rather desperate state right now. Let us make Chairnerd more useful by adding two new features to it.

1. Deleting Posts
We would like to be able to delete posts after they are added. Each post should have a delete button somewhere within each post that deletes it from both the view and the storage layer.


2. An Undo Button
Unfortunately, with the ability to delete posts we now might accidentally remove a post that contains some treasured memories. To fix this, add an undo button that is able to undo both addition and deletion of posts. For example, if I add a post and delete a post and press undo twice, the added post should be removed and the deleted post should be restored. The ordering of the posts before and after the undo **must** be preserved. If I add x posts and press undo x times, the x posts should be deleted.

You only need to be able to undo actions taken within a browser session; if you delete a post and close the window, it is all right if that post is gone forever.

Version Control
===

Please keep a history of your changes to the project in Git.


Restrictions
===

In completing this task, you must observe the following restriction: the **only** external libraries you may use are those that deal with the manipulation of data strucures. You may include a library that does more than that, but only if you limit your use of it to the manipulation of data structures. Examples of acceptable libraries are lo-dash or mori. An example of a mostly unacceptable library is jQuery, because it deals directly with DOM manipulation. You may, however, use jQuery.extend if you choose. You may not use frameworks such as Backbone, Angular, or React.

