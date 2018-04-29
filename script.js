google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(draw);

//bdac085832244535b88f47cc4a77ca4d
//FIREBASE
  var config = {
    apiKey: "AIzaSyDEK9i0ObP-h3_as-0IT9XKBGyn349U-s4",
    authDomain: "cryptograph-91e3c.firebaseapp.com",
    databaseURL: "https://cryptograph-91e3c.firebaseio.com",
    projectId: "cryptograph-91e3c",
    storageBucket: "cryptograph-91e3c.appspot.com",
    messagingSenderId: "747537710361"
  };
  firebase.initializeApp(config);
var currentUid = null;
var name = null;
 
 firebase.auth().onAuthStateChanged(function(user) {   
  if (user && user.uid != currentUid) {
      console.log(user.uid);
    currId = user.uid;
    $("#user").text(user.displayName)
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
        var th = snapshot.val()["theme"];
        if (th == "lite"){
            theme();
        }
    });
  } else {  
   console.log("no user signed in");  
  }  
 });

//NEWS

var news_url = 'https://newsapi.org/v2/top-headlines?language=en&q=bitcoin&sortBy=publishedAt&' + 
    'apiKey=bdac085832244535b88f47cc4a77ca4d'

gen_news(news_url);

function gen_news(url) {
    $.getJSON(url, function(data) {  
    articles = data.articles;
    $("#news").empty();
    for (art in articles){
        t = (articles[art].publishedAt).replace("T", " ").replace("Z", " ");
        $("#news").append("<div class = \"article\"><img src=\'" + articles[art].urlToImage + "\'><h2><a href = \"" + articles[art].url + "\">" + articles[art].title + "</a></h2><h5>" + t + "</h5><p>" + articles[art].description + "</p></div>")
    }
});
}

//GRAPH

function tableSelectHandler(e){
    var selectedItem = chart.getChart().getSelection()[0];
    var true_selected =  chart.getDataTable().getTableRowIndex(selectedItem.row)
    console.log(true_selected);
}

var url = "https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=168&aggregate=1&e=CCCAGG";
var crypt = "BTC";
var tim = "168";

//GRAPh

$("#start").focus();

function time(arg){
    t = $(arg).text();
    fill = "24";
    console.log(t);
    if(t == "1W"){
        fill = "168";
    }else if(t == "1M"){
        fill = "730";
    }else if(t == "1Y"){
        fill = "8760";
    }
    else{
        fill = "24";
    }
    tim = fill;
    url = "https://min-api.cryptocompare.com/data/histohour?fsym=" + crypt + "&tsym=USD&limit=" + fill + "&aggregate=1&e=CCCAGG";
    draw();
}

function coin(arg){
    c = $(arg).text();
    crypt = c
    url = "https://min-api.cryptocompare.com/data/histohour?fsym=" + crypt + "&tsym=USD&limit=" + tim + "&aggregate=1&e=CCCAGG";
    $("#name").text(crypt)
    $("#news_head").text(crypt + " News")
    if(crypt == "BTC"){
        news_url = 'https://newsapi.org/v2/top-headlines?language=en&q=bitcoin&sortBy=publishedAt&apiKey=bdac085832244535b88f47cc4a77ca4d'
    }
    if(crypt == "ETH"){
        news_url = 'https://newsapi.org/v2/everything?language=en&q=ethereum&sortBy=publishedAt&apiKey=bdac085832244535b88f47cc4a77ca4d'
    }
    else if(crypt == "LTC"){
        news_url = 'https://newsapi.org/v2/everything?language=en&q="+Litecoin"&sortBy=publishedAt&apiKey=bdac085832244535b88f47cc4a77ca4d'
    }
    gen_news(news_url);
    draw();
}

line = "#ffdc4b";
back = "#171616";
alt_line = "#23a2ff";
alt_back = "ghostwhite";

lite = false;

function theme() { 
    if(!lite){
        document.getElementById('theme_css').href = '../style_lite.css';
        line = alt_line;
        back = alt_back;
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
            theme: "lite"
        });
        draw();
    }
    else{
        document.getElementById('theme_css').href = '../style_dark.css';
        line = "#ffdc4b";
        back = "#171616";
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
            theme: "dark"
        });
        draw();
    }
    lite = !lite;
    
};

function draw() {
    var dataPoints = [];
$.getJSON(url, function(data) {  
    var i = 0;
    var base = 0;
    $.each(data.Data, function(key, value){
        if(i == 0){
            base = value.close;
        }
        var d = new Date(0); 
        d.setUTCSeconds(value.time);
        dataPoints.push([d, value.close, base]);
        i++;
    });
    var data = new google.visualization.DataTable();
      data.addColumn('date', 'X');
      data.addColumn('number', 'BTC');
     data.addColumn('number', 'baseline')
    
      data.addRows(dataPoints);
    
    $("#price").text("$" + dataPoints[dataPoints.length-1][1]);
    
    perc_ch = ((dataPoints[dataPoints.length-1][1] - base)/(base*1.0))*100;
      
      if(perc_ch >= 0){
      $("#change").text("+" + perc_ch.toFixed(2) + "%");
      $("#change").css('color', 'green');
      }
    else {
        $("#change").text("-" + Math.abs(perc_ch.toFixed(2)) + "%");
          $("#change").css('color', 'red');
    }
    str = dataPoints[dataPoints.length-1][0].toDateString() + " " + dataPoints[dataPoints.length-1][0].toLocaleTimeString();
    $("#dt").text(str)

      var options = {
              tooltips: {
                mode: 'label'  // or 'x-axis'
              },
          chartArea: {
              left: 0,
              right: 0,
              top: -10,
              bottom: -10
          },
          pointSize: 0,
          backgroundColor: {
          fill: back
        },
          colors: [line],
          vAxis: {
              textPosition: 'none',
            gridlines: {
                color: 'transparent'
                }
            },
          series: {
              0: {
                  lineWidth: 3
              },
              1: {
                  color: '#adabab',
                  lineDashStyle: [10, 2],
                  enableInteractivity: false
              }
          },
          
          hAxis: {
              textPosition: 'none',
              
            gridlines: {
                color: 'transparent'
                }
            },
          tooltip: {
            trigger: 'none'
        },
          crosshair: { trigger: 'both', 
                      orientation: 'vertical',
                      color: '#c7c7c7'
                     }
      };

    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    var container = document.getElementById('chart_div');

    google.visualization.events.addListener(chart, 'onmouseover', function(e) {
        str = dataPoints[e.row][0].toDateString() + " " + dataPoints[e.row][0].toLocaleTimeString();
        $("#dt").text(str)
        var price = dataPoints[e.row][1];
        $("#price").text("$" + price)
        perc_ch = ((price - base)/(base*1.0))*100;
      
      if(perc_ch >= 0){
      $("#change").text("+" + perc_ch.toFixed(2) + "%");
      $("#change").css('color', 'green');
      }
    else {
        $("#change").text("-" + Math.abs(perc_ch.toFixed(2)) + "%");
          $("#change").css('color', 'red');
    }
    });
    
    google.visualization.events.addListener(chart, 'onmouseout', function(e) {
    str = dataPoints[dataPoints.length-1][0].toDateString() + " " + dataPoints[dataPoints.length-1][0].toLocaleTimeString();
        $("#dt").text(str)
        var price = dataPoints[dataPoints.length-1][1];
        $("#price").text("$" + price)
        perc_ch = ((dataPoints[dataPoints.length-1][1] - base)/(base*1.0))*100;
      
      if(perc_ch >= 0){
      $("#change").text("+" + perc_ch.toFixed(2) + "%");
      $("#change").css('color', 'green');
      }
    else {
        $("#change").text("-" + Math.abs(perc_ch.toFixed(2)) + "%");
          $("#change").css('color', 'red');
    }
    });
    
    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler() {  
        chart.setSelection([])
    }
    
    chart.draw(data, options);
});
    
    
}