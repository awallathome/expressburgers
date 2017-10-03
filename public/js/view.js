$(document).ready(function() {
  // Getting a reference to the input field where user adds a new burger
  var $newItemInput = $("input.new-item");
  // Our new burgers will go inside the todoContainer
  var $todoContainer = $(".burger-container");
  // Adding event listeners for deleting, editing, and adding burgers
  $(document).on("click", "button.delete", deleteburger);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".burger-item", editburger);
  $(document).on("keyup", ".burger-item", finishEdit);
  $(document).on("blur", ".burger-item", cancelEdit);
  $(document).on("submit", "#burger-form", insertburger);

  // Our initial burgers array
  var burgers = [];

  // Getting burgers from database when page loads
  getburgers();

  // This function resets the burgers displayed with new burgers from the database
  function initializeRows() {
    $burgerContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < burgers.length; i++) {
      rowsToAdd.push(createNewRow(burgers[i]));
    }
    $burgerContainer.prepend(rowsToAdd);
  }

  // This function grabs burgers from the database and updates the view
  function getburgers() {
    $.get("/api/burgers", function(data) {
      burgers = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteburger(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/burgers/" + id
    }).done(getburgers);
  }

  // This function handles showing the input box for a user to edit a burger
  function editburger() {
    var currentburger = $(this).data("burger");
    $(this).children().hide();
    $(this).children("input.edit").val(currentburger.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    var burger = $(this).parent().data("burger");
    burger.complete = !burger.complete;
    updateburger(burger);
  }

  // This function starts updating a burger in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit() {
    var updatedburger = $(this).data("burger");
    if (event.keyCode === 13) {
      updatedburger.text = $(this).children("input").val().trim();
      $(this).blur();
      updateburger(updatedburger);
    }
  }

  // This function updates a burger in our database
  function updateburger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    }).done(getburgers);
  }

  // This function is called whenever a burger item is in edit mode and loses focus
  
  function cancelEdit() {
    var currentburgers = $(this).data("burger");
    if (currentburgers) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentburgers.text);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a burger-item row
  function createNewRow(burgers) {
    var $newInputRow = $(
      [
        "<li class='list-group-item burger-item'>",
        "<span>",
        burgers.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='btn eat-btn-default'>Eat a Burger</button>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", burgers.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("burgers", burgers);
    if (burgers.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

  // This function inserts a new burger into our database and then updates the view
  function insertburger(event) {
    event.preventDefault();
    var burgers = {
      text: $newItemInput.val().trim(),
      complete: false
    };

    $.post("/api/burgers", burgers, getburgers);
    $newItemInput.val("");
  }
});
