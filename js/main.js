$(document).ready(function () {
  // ! Get Data
  let PageOne = $.ajax({
    async: false,
    url: "https://reqres.in/api/users?page=1",
    type: "get",
    data: { GetConfig: "YES" },
    dataType: "JSON",
  }).responseJSON;
  let PageTwo = $.ajax({
    async: false,
    url: "https://reqres.in/api/users?page=2",
    type: "get",
    data: { GetConfig: "YES" },
    dataType: "JSON",
  }).responseJSON;

  let AllInfo = [];
  AllInfo.push(...PageOne.data);
  AllInfo.push(...PageTwo.data);

  let AllID = [];
  for (let i = 0; i < AllInfo.length; i++) {
    AllID.push(AllInfo[i].id);
  }

  // ! Create & show Post
  function CreateShow() {
    function CreatePost() {
      let main = $("<div></div>").addClass(
        "mt-3 col-12 col-md-6 col-lg-4 items"
      );
      let card = $("<div></div>").addClass("card");
      let img = $('<img class="card-img-top">').attr("src", "");
      let cardbody = $("<div></div>").addClass("card-body");
      let cardtitle = $("<h5></h5>").addClass("card-title");
      cardtitle.text("id: ");
      let cardtext = $("<p></p>").addClass("card-text");
      cardtext.text("email: ");
      let span = $("<span></span>");
      let button = $("<button></button>").addClass("P btn btn-primary");
      button.attr("data-toggle", "modal");
      button.attr("data-target", "#myModal");
      button.text("user profile");

      cardtext.append(span);
      main.append(card);
      card.append(img);
      card.append(cardbody);
      cardbody.append(cardtitle);
      cardbody.append(cardtext);
      cardbody.append(button);
      $("#post").append(main);
    }

    //! Show Post
    for (let i = 0; i < AllInfo.length; i++) {
      CreatePost();
      $(".card-img-top")[i].src = AllInfo[i].avatar;
      $(".card-title")[i].innerHTML += `<span>${AllInfo[i].id}</span>`;
      $(".card-text span")[i].innerHTML = AllInfo[i].email;
    }

    // ! show in modal
    $(".P").click(function () {
      $(".create").addClass("d-none");
      let IdSeleced = +$(this).parent().children().find("span").html();
      for (let info of AllInfo) {
        if (info.id === IdSeleced) {
          $(".showId").val(info.id);
          $(".showF").val(info.first_name);
          $(".showL").val(info.last_name);
          $(".showE").val(info.email);
          $(".showP").attr("src", info.avatar);
        }
      }

      // ! change photo
      $("#myFile").change(function (event) {
        $("#img")
          .fadeIn("fast")
          .attr("src", URL.createObjectURL(event.target.files[0]));
      });


      // ! Update
      $(".update").click(function () {
        let filePath = $("#myFile").val();
        let RealSrc = "assets/" + filePath.substr(12);

        for (let info of AllInfo) {
          for (const key in info) {
            if (info[key] === IdSeleced) {
              IdSeleced = undefined;
              let pos = AllInfo.indexOf(info);
              let firstSrc = AllInfo[pos].avatar;
              if (RealSrc === "assets/") {
                AllInfo[pos].avatar === firstSrc;
                console.log(AllInfo[pos].avatar);
              } else {
                AllInfo[pos].avatar = RealSrc;
                $("#myFile").val("");
              }
              AllInfo[pos].first_name = $(".showF").val();
              AllInfo[pos].last_name = $(".showL").val();
              AllInfo[pos].email = $(".showE").val();
              $(".row1").empty();
              CreateShow();
              pagination();
            }
          }
        }
      
      });
    
    });
  }
  CreateShow();




  // ! pagination
  function pagination() {
    var items = $("#post .items");
    var numItems = items.length;
    var perPage = 6;

    items.slice(perPage).hide();

    $("#pagination-container").pagination({
      items: numItems,
      itemsOnPage: perPage,
      prevText: "&laquo;",
      nextText: "&raquo;",
      onPageClick: function (pageNumber) {
        var showFrom = perPage * (pageNumber - 1);
        var showTo = showFrom + perPage;
        items.hide().slice(showFrom, showTo).show();
      },
    });
  }
  pagination();




  // ! delete profile
  $(".del").click(function () {
    for (let info of AllInfo) {
      for (const key in info) {
        if (info[key] === +$(".showId").val()) {
          AllInfo.splice(AllInfo.indexOf(info), 1);
          $(".row1").empty();
          CreateShow();
          pagination();
        }
      }
    }
  });



  // ! Set photo For New User
  $("#myFile1").change(function (event) {
    $("#img1")
      .fadeIn("fast")
      .attr("src", URL.createObjectURL(event.target.files[0]));
  });





  // ! Create New profile
  $(".Create1").click(function () {
    $(".showId1").val("");
    $(".showF1").val("");
    $(".showL1").val("");
    $(".showE1").val("");
    $("#myFile1").val("");
    $(".create1").click(function () {
      if (AllID.includes(+$(".showId1").val())) {
        alert("this id has been selected");
      } else {
        let filePath = $("#myFile1").val();
        let new_Profile = "assets/" + filePath.substr(12);
        let new_User = {};
        new_User.id = +$(".showId1").val();
        new_User.first_name = $(".showF1").val();
        new_User.last_name = $(".showL1").val();
        new_User.email = $(".showE1").val();
        new_User.avatar = new_Profile;
        AllInfo.push(new_User);
        
        // ! Find & Delete Similar obj
        for (let i = 0; i < AllInfo.length - 1; i++) {
          if (AllInfo[i + 1].id == AllInfo[i].id) {
            AllInfo.splice(i,1);
          }
        }
        $(".row1").empty();
        CreateShow();
        pagination();
      }
    });
  });
});
