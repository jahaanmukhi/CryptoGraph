console.log(firebase.auth().currentUser);

var db = firebase.database();

var investRef = db.ref('users/' + currentUid);
investRef.once('value').then(function(snapshot) {
  console.log(snapshot.val());
});
var bank = 100000;
var btc = [];
var eth = [];
var ltc = [];
var ltp = [];
coins = ["BTC", "ETH", "LTC"];
for (var v in coins){
    url = "https://min-api.cryptocompare.com/data/price?fsym=" + coins[v] + "&tsyms=USD";
    $.getJSON(url, function(data) {  
        ltp.push(data.USD);
    });
}
