$(document).ready(function() {
    // $(".progress-bar").css("opacity", "1");
    // $(".progress").css("opacity", "1");
    // // var url = "https%3A%2F%2Fmyrss.nu%2Fdrama";
    // // var url = "https://myrss.nu/drama";
    // var url = "http://irss.se/dramas/";
    // getContent(url);
    // putHomeBtn(url);
    // putIntoBreadCrumbs(url, "Home");
    // bindHomeBtn();
    // $(".backBtn").hide();
  $.ajax({
      type: "GET",
      url: "http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=67559&SST=True",
      headers: {"AccountKey": "IcVluPp0S7m4gZ8U7PkP8w=="}
    }).done(function(data){
        console.log(data);
    });

  $(".search input").focus(function(){
    $(this).parents(".wrapper").addClass("focus");
  });

  $(".search input").blur(function(){
    $(this).parents(".wrapper").removeClass("focus");
  });

});

// $(document).on("", "click", function(e)){}
function bindClickEvent() {
    $(".content .items").click(function(e) {
        // increaseProgress();
        e.preventDefault();
        console.log("clicked");
        var url = $(this).find("a").attr("href");
        var title = $(this).find("span").text();

        if (!(url.startsWith("http://irss.se")) && !(url.startsWith("http://videobug.se"))) {
            window.open(url);
        } else {
            if (!($(this).find("span").text().startsWith("Page"))) {
                putIntoBreadCrumbs(url, title);
            }
            getContent(url);
        }
        bindBackBtn();
    });
}

function putIntoBreadCrumbs(url, title) {
    $(".breadcrumbs").append("<span class=\"breadcrumbs-items\"><a href=\"" + url + "\">" + title + "</a></span>");
    bindBreadCrumbsBtn();
}

function putBackBtn(prevUrl) {
    var prevUrl = prevUrl;
    $(".backBtn").attr("href", prevUrl);
}

function putHomeBtn(prevUrl) {
    var prevUrl = prevUrl;
    $(".homeBtn").attr("href", prevUrl);
}

function pupoluteUrlintoBackBtn() {
    if ($(".breadcrumbs-items").length >= 2) {
        var secondLast = $(".breadcrumbs-items").length - 1;
        var secondLastUrl = $(".breadcrumbs-items:nth-child(" + secondLast + ")").find("a").attr("href");
        $(".backBtn").attr("href", secondLastUrl);
    }
}

function bindBackBtn(url) {
    $(".backBtn").off().click(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var prevUrl = $(this).attr("href");
        getContent(prevUrl);
        $(".breadcrumbs-items:last-child").remove();
    });

}

function bindHomeBtn() {
    $(".homeBtn").off().click(function(e) {
        e.preventDefault();
        var prevUrl = $(this).attr("href");
        getContent(prevUrl);
        $(".breadcrumbs-items:not(:first-child)").remove();
    });
}

function bindBreadCrumbsBtn() {
    $(".breadcrumbs span").off().click(function(e) {
        e.preventDefault();
        var url = $(this).find("a").attr("href");
        getContent(url);

        if ($(this).find("a").parent(".breadcrumbs-items").is(":first-child")) {
            $(".breadcrumbs-items:not(:first-child)").remove();
        } else {
            var currentIndex = $(this).find("a").parent(".breadcrumbs-items").index();
            $(".breadcrumbs-items").each(function(index) {
                if (currentIndex < index) {
                    // var newIndex = index + 1;
                    $(".breadcrumbs-items")[currentIndex + 1].remove();
                }
            });
        }
    });
}

function getContent(url) {
    $(".overlay").fadeIn();
    $(".progress-bar").css("opacity", "1");
    $(".progress").css("opacity", "1");
    $("body").addClass("disable-scrolling");

    $(".backBtn").show();

    pupoluteUrlintoBackBtn();

    // Compile content
    var source = $("#content-template").html();
    var template = Handlebars.compile(source);

    // Compile content
    var sourceOnlyOne = $("#content-template-only-one").html();
    var templateOnlyOne = Handlebars.compile(sourceOnlyOne);


    // find some demo xml - DuckDuckGo is great for this
    var xmlSource = url;

    // build the yql query. Could be just a string - I think join makes easier reading
    var yqlURL = [
        "http://query.yahooapis.com/v1/public/yql",
        "?q=" + encodeURIComponent("select * from xml where url='" + xmlSource + "'"),
        "&format=xml&callback=?"
    ].join("");

    console.log(yqlURL);

    // var urlPrefix = "https://api.rss2json.com/v1/api.json?=" + url + "&api_key=xm1lxzp3eidynkzud6jmqlowtahpvw2prqwhehnz";
    // var urlPrefix = "https://api.rss2json.com/v1/api.json";

    $.ajax({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                    $('.progress').css({
                        width: percentComplete * 100 + '%'
                    });
                    if (percentComplete === 1) {
                        $('.progress').addClass('hide');
                    }
                }
            }, false);
            xhr.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                    $('.progress').css({
                        width: percentComplete * 100 + '%'
                    });
                }
            }, false);
            return xhr;
        },
        url: yqlURL,
        dataType: "jsonp",
        type: 'GET',
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');
        }
        // data: {
        //     "rss_url": url,
        //     "api_key": "xm1lxzp3eidynkzud6jmqlowtahpvw2prqwhehnz"
        // }
    }).done(function(data) {

        var x2js = new X2JS();
        var jsonObj = x2js.xml_str2json(data.results);

        console.log(jsonObj);

        // data.items[1].content.replace("src", "data-echo");
        // <img src="img/placeholder.svg" data-echo="{{imgUrl}}" />
        echo.init();
        $(".overlay").fadeOut();
        $("body").removeClass("disable-scrolling");

        $(".progress").css("width", "100%");
        $(".progress-bar").css("opacity", "0");
        $(".progress").css("opacity", "0");

        if (jsonObj.rss.channel.item.length > 1) {
            var html = template(jsonObj.rss.channel);
        } else {
            var html = templateOnlyOne(jsonObj.rss.channel.item);
        }


        $(".content").html(html);
        bindClickEvent();
        nextPrevBtn();
        replaceAmp();
        imgReplace();
        overrideBrowserBack();


        if ($(".breadcrumbs-items").length == 1) {
            $(".backBtn").hide();
        }
    });
}

function replaceAmp() {
    $(".content .items a").each(function() {
        var newUrl = $(this).attr("href").replace('&amp;', '&');
        $(this).attr("href", newUrl);
    });
}

function increaseProgress() {
    var progress = 0;
    var progressInterval = setInterval(function() {
        progress += 1;
        if (progress == 100) {
            clearInterval(progressInterval)
        }
        $(".progress").css("width", progress + "%");
        console.log(progress);
    }, 100);
}

function nextPrevBtn() {
    $(".items").each(function() {
        if ($(this).find("span").text().startsWith("Page")) {
            $(this).addClass("navigate");
        }
    });
    setPrevNext();
}

function setPrevNext() {
    var nav = [];
    $(".navigate").each(function() {
        var spanText = $(this).find("span").text();
        var lastChar = spanText.substr(spanText.length - 1);
        nav.push(lastChar);
    });

    if (nav.length == 1) {
        $('.navigate').addClass("next");
    } else {
        if (nav[0] > nav[1]) {
            $('.navigate').first().addClass("next");
            $('.navigate').last().addClass("prev");
        } else {
            $('.navigate').first().addClass("prev");
            $('.navigate').last().addClass("next");
        }

    }
}

function imgReplace() {
    $(".items").each(function() {

        if($(this).find("img").attr("src").endsWith("play.png")){
            $(this).find("img").attr("src", "img/play.svg");
        }

        if ($(this).find("span").text().startsWith("HK Drama")) {
            $(this).find("img").attr("src", "img/hkdrama.png");
        } else if ($(this).find("span").text().startsWith("HK Variety & News")) {
            $(this).find("img").attr("src", "img/hkshow.png");
        } else if ($(this).find("span").text().startsWith("Hong Kong Movies")) {
            $(this).find("img").attr("src", "img/hkmovie.png");
        } else if ($(this).find("span").text().startsWith("Korean Variety")) {
            $(this).find("img").attr("src", "img/koreashow.png");
        } else if ($(this).find("span").text().startsWith("Korean Movies")) {
            $(this).find("img").attr("src", "img/koreamovie.png");
        } else if ($(this).find("span").text().startsWith("Korean Drama")) {
            $(this).find("img").attr("src", "img/koreadrama.png");
        } else if ($(this).find("span").text().startsWith("Recently")) {
            $(this).find("img").attr("src", "img/recent.png");
        } else if ($(this).find("span").text().startsWith("Chinese Drama")) {
            $(this).find("img").attr("src", "img/chinadrama.png");
        } else if ($(this).find("span").text().startsWith("Chinese Shows")) {
            $(this).find("img").attr("src", "img/chinashow.png");
        } else if ($(this).find("span").text().startsWith("Chinese Movies")) {
            $(this).find("img").attr("src", "img/chinamovie.png");
        }else if ($(this).find("span").text().startsWith("Japanese Drama")) {
            $(this).find("img").attr("src", "img/japandrama.png");
        } else if ($(this).find("span").text().startsWith("Japanese Movies")) {
            $(this).find("img").attr("src", "img/japanmovie.png");
        }
    });
}

function overrideBrowserBack(){
    if (window.history && window.history.pushState) {

    window.history.pushState('forward', null, './#');

    $(window).on('popstate', function() {
        $(".breadcrumbs span:first-child").trigger("click");
    });

  }
}
