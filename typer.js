console.log("reminder that you need to manually reload extension if you changed manifest.json")
let curCmd = true;
let selectAll = false;
let textSelectAll = "";
let DEV = true
// 0 = no log, 1 = minimal, 2 = all
let LOGV = 5

let serverIp = DEV ? "http://localhost:9000/" : "http://localhost:9654/"


function getAllElementsWithAttribute(attribute) {
  var matchingElements = [];
  var allElements = document.getElementsByTagName('');
  for (var i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute(attribute) !== null) {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

function toTimeZone(time) {
  return moment.utc(time).local().format()//.toISOString()
}


$(document).ready(function () {
  console.log("Injected typerjs!");

  let siteHost = document.location.host
  let onMessenger = siteHost == "www.messenger.com" ? true : false
  if (LOGV > 0) console.log(`You are currently on ${siteHost}`)

  let sendMessage = function (message, deletedText) {
    currentDate = new Date()
    localDate = toTimeZone(currentDate)
    //console.log(localDate)
    fbidArr = document.location.pathname.match(/(?<=\/t\/).+/);
    fbid = fbidArr[0]
    if (LOGV > 0) console.log(`You are talking to ${fbid}`);

    $.ajax({
      url: serverIp + "messenger_sent_text",
      type: 'POST',
      //dataType: "json", // expected format for response // commented out bc it couldn't parse response
      contentType: 'application/json',//'application/x-www-form-urlencoded; charset=ISO-8859-2', // send as url encoded
      data: JSON.stringify({
        unixt: parseInt(parseInt(currentDate.getTime())),
        ts: localDate,
        deletedText: deletedText,
        FBID: fbid,
        message: message,
      }),
      success: function (data, status) {
        if (LOGV > 0) console.log("Data: " + data + "\nStatus: " + status);
      }, error: function (data, status) {
        if (LOGV > 0) console.log("Data: " + data + "\nStatus: " + status);
      }
    });
  }

  let sendField = function (message, deletedText) {
    currentDate = new Date()
    localDate = toTimeZone(currentDate)
    $.ajax({
      url: serverIp + "typer_sent_field",
      type: 'POST',
      dataType: "json",
      contentType: 'application/json',
      data: JSON.stringify({
        unixt: parseInt(parseInt(currentDate.getTime())),
        ts: localDate,
        deletedText: deletedText,
        url: siteHost,
        sentText: message,
      }),
      success: function (data, status) {
        if (LOGV > 0) console.log("Data: " + data + "\nStatus: " + status);
      }, error: function (data, status) {
        if (LOGV > 0) console.log("Data: " + data + "\nStatus: " + status);
      }
    });
  }


  function handleKeyUp(key) {
    // NOTE: These keycodes only work for chrome
    // Detects when left or right cmd is pressed
    if (key.keyCode == 91 || key.keyCode == 93) {
      curCmd = false;
    }
  }
  function handleKeyDown(key, textVal, isMessenger) {
    // Deleted messages
    if (key.keyCode == 91 || key.keyCode == 93) {
      curCmd = true;
    }
    if ((key.keyCode === 8 || key.keyCode === 46) && selectAll) {
      if (LOGV > 0) console.log(`You deleted: ${textSelectAll}`)
      selectAll = false;
      if (onMessenger) sendMessage(textSelectAll, deletedText = true);
      else sendField(textSelectAll, deletedText = true);
    }
    else if (key.metaKey && key.keyCode == 65) {
      textSelectAll = textVal;
      if (LOGV > 0) console.log("selected all")
      selectAll = true;
    } else {
      if (key.keyCode >= 48 && key.keyCode <= 90) {
        selectAll = false;
      }
    }

    // hit enter
    if (key.keyCode === 13) {
      let sentVal = textVal;
      if (LOGV > 0) console.log(`sent ${sentVal}`);
      if (isMessenger){
        sendMessage(sentVal, deletedText = false);
      } else {
        sendField(sentVal, deletedText = false);
      }
    }
  }

  // for facebook messenger
  document.body.addEventListener('keydown', function (key) {
    if (onMessenger) {
      textVal = $("[aria-label='Type a message...']").first().children().first().children().first().children().first().children().first().children().first().html();
      handleKeyDown(key, textVal, isMessenger = true);
    }
  });

  document.body.addEventListener('keyup', function (key) {
    if (onMessenger) {
      handleKeyUp(key);
    }
  });

  $(":input").not("input:password").not("textarea").keydown(function (key) {
    handleKeyDown(key, key.target.value, isMessenger = false);
  });

  $(":input").not("input:password").not("textarea").keyup(function (key) {
    handleKeyUp(key);
  });

});

