var modal
var modalContent
var lastNumEggs=-1
var lastNumMiners=-1
var lastSecondsUntilFull=100
lastHatchTime=0
var eggstohatch1=2592000
var lastUpdate=new Date().getTime()
var modalID=0
var baseNum = '';
var currentAddr = '';
var spend;
var usrBal;

window.addEventListener('load', async function() {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable() // Request access
        minersContract = await new web3.eth.Contract(minersAbi, minersAddr)
        tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddr)
        let accounts = await web3.eth.getAccounts()
        currentAddr = accounts[0]
        setTimeout(function(){
            controlLoop()
            controlLoopFaster()
        },1000);
      } catch (error) {
          // User denied account access...
          console.error(error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      minersContract = await new web3.eth.Contract(minersAbi, minersAddr)
      tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddr)
      let accounts = await web3.eth.getAccounts()
      currentAddr = accounts[0]
      setTimeout(function(){
          controlLoop()
          controlLoopFaster()
      },1000);
    }
    
    var prldoc=document.getElementById('playerreflink')
    prldoc.textContent=window.location.origin+"/index.htm?ref="+currentAddr
    var copyText = document.getElementById("playerreflink");
    copyText.value=prldoc.textContent

    //var ref1 = document.getElementById('ref-link');
    //var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f');
    //var encr = CryptoJS.AES.encrypt(currentAddr, key, { mode: CryptoJS.mode.ECB });
    //var decr = CryptoJS.AES.decrypt(encr.toString(), key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
    //ref1.textContent=window.location.origin+"/BOOMiner/index.html?ref=" + "XX" + encr.toString();
})

function approve() {
    var trxspenddoc=document.getElementById('spend-allowance')
    console.log(trxspenddoc);
    approveCAKE(web3.utils.toWei(trxspenddoc.value.toString()));
}

function controlLoop(){
    refreshData()
    setTimeout(controlLoop,25000)
}
function controlLoopFaster(){
    //liveUpdateEggs()
    // liveUpdatePeers()
    setTimeout(controlLoopFaster,30)
}

function stripDecimals(str, num){
	if (str.indexOf('.') > -1){
		var left = str.split('.')[0];
		var right = str.split('.')[1];
		return left + '.' + right.slice(0,num);
	}
	else {
		return str;
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function refreshData(){

    /*var balanceElem = document.getElementById('contract-balance');
    var baseNum = 0;
    contractBalance(function(result){
        rawStr = numberWithCommas(Number(result).toFixed(3));
        balanceElem.textContent = stripDecimals(rawStr, 2) + ' CAKE';
    });*/

    // UserTotalDeposits 
    var userDepositElem = document.getElementById('user-deposits');
    var baseNum = 0;
    userTotalDeposits(function(result){
        rawStr = numberWithCommas(Number(result).toFixed(2));
        userDepositElem.textContent = stripDecimals(rawStr, 3) + ' CAKE';
    });

    var investedElem = document.getElementById('total-invested');
    var baseNum = 0;
    totalInvested(function (result) {
        rawStr = numberWithCommas(Number(result).toFixed(2));
        investedElem.textContent = stripDecimals(rawStr, 2) + ' CAKE';
    });


    var userDownlineCountElem = document.getElementById('user-downline-count');
    userDownlineCount(function(result){
        rawStr = Number(result).toFixed(0);
        userDownlineCountElem.textContent = stripDecimals(rawStr);
    });

   // userDividends

    var userDividendsElem = document.getElementById('user-dividends');
    userDividends(function(result){
        rawStr = Number(result).toFixed(4);
        userDividendsElem.textContent = stripDecimals(rawStr) + ' CAKE';
    });

    var userAvailableElem = document.getElementById('user-available');
    userAvailable(function(result){
        rawStr = Number(result).toFixed(4);
        userAvailableElem.textContent = stripDecimals(rawStr) + ' CAKE';
    });


    // var userAmountOfDepositsElem = document.getElementById('user-amount-of-deposits');
    // userAvailable(function(result){
        // rawStr = Number(result).toFixed(0);
        // userAmountOfDepositsElem.textContent = stripDecimals(rawStr) + ' CAKE';
    // });

    var userTotalWithdrawnElem = document.getElementById('user-total-withdrawn');
    userTotalWithdrawn(function(result){
        rawStr = Number(result).toFixed(4);
        userTotalWithdrawnElem.textContent = stripDecimals(rawStr) + ' CAKE';
    });

    var userReferralTotalBonusElem = document.getElementById('user-referral-total-bonus');
    userReferralTotalBonus(function(result){
        rawStr = Number(result).toFixed(4);
        userReferralTotalBonusElem.textContent = stripDecimals(rawStr) + ' CAKE';
    });

    
    var userTotalReferralsElem = document.getElementById('user-total-referrals');
    userTotalReferrals(function(result){
        rawStr = Number(result).toFixed(0);
        userTotalReferralsElem.textContent = rawStr.toLocaleString() + " CAKE";
    });

    var spentLimitElem = document.getElementById('spend-limit');
    spendLimit(function(result){
        rawStr = Number(result).toFixed(0);
        spentLimitElem.textContent = rawStr.toLocaleString() + " CAKE";
    });

    var userBalanceElem = document.getElementById('user-balance');
    userBalance(function(result){
        rawStr = Number(result).toFixed(0);
        userBalanceElem.textContent = rawStr.toLocaleString() + " CAKE";
    });

}



function investInPlan1(){
    var trxspenddoc=document.getElementById('eth-to-spend1');
    ref=getQueryVariable('ref');
    plan = 1-1;
    //console.log("REF:" + ref);
    if (!web3.utils.isAddress(ref)){ref=currentAddr}
    //console.log(trxspenddoc.value)
    invest(ref, plan, trxspenddoc.value,  function(){
        displayTransactionMessage();
    });
}

function investInPlan2(){
    var trxspenddoc=document.getElementById('eth-to-spend2');
    ref=getQueryVariable('ref');
    plan = 2-1;
    //console.log("REF:" + ref);
    if (!web3.utils.isAddress(ref)){ref=currentAddr}
    invest(ref, plan, trxspenddoc.value,  function(){
        displayTransactionMessage();
    });
}

function investInPlan3(){
    var trxspenddoc=document.getElementById('eth-to-spend3');
    ref=getQueryVariable('ref');
    plan = 3-1;
    //console.log("REF:" + ref);
    if (!web3.utils.isAddress(ref)){ref=currentAddr}
    invest(ref, plan, trxspenddoc.value,  function(){
        displayTransactionMessage();
    });
}

function investInPlan4(){
    var trxspenddoc=document.getElementById('eth-to-spend4');
    ref=getQueryVariable('ref');
    plan = 4-1;
    //console.log("REF:" + ref);
    if (!web3.utils.isAddress(ref)){ref=currentAddr}
    invest(ref, plan, trxspenddoc.value,  function(){
        displayTransactionMessage();
    });
}





function removeModal2(){
    $('#adModal').modal('toggle');
}
function removeModal(){
        modalContent.innerHTML=""
        modal.style.display = "none";
}
function displayTransactionMessage(){
    displayModalMessage("Transaction Submitted")
}
function displayModalMessage(message){
    modal.style.display = "block";
    modalContent.textContent=message;
    setTimeout(removeModal,3000)
}
function formatTrxValue(trxstr){
    return parseFloat(parseFloat(trxstr).toFixed(4));
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function secondsToString(seconds)
{
    seconds=Math.max(seconds,0)
    var numdays = Math.floor(seconds / 86400);

    var numhours = Math.floor((seconds % 86400) / 3600);

    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

    var numseconds = ((seconds % 86400) % 3600) % 60;
    var endstr=""

    return numhours + "h " + numminutes + "m "//+numseconds+"s";
}
function disableButtons(){
    var allnumminers=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumminers.length;i++){
        if(allnumminers[i]){
            allnumminers[i].style.display="none"
        }
    }
    var allnumminers=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumminers.length;i++){
        if(allnumminers[i]){
            allnumminers[i].style.display="none"
        }
    }
}
function enableButtons(){
    var allnumminers=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumminers.length;i++){
        if(allnumminers[i]){
            allnumminers[i].style.display="inline-block"
        }
    }
        var allnumminers=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumminers.length;i++){
        if(allnumminers[i]){
            allnumminers[i].style.display="inline-block"
        }
    }
}
function onlyLetters(text){
    return text.replace(/[^0-9a-zA-Z\s\.!?,]/gi, '')
}
function checkOnlyLetters(str){
    var pattern=new RegExp('^[0-9a-zA-Z\s\.!?,]*$')
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
}
function onlyurl(str){
     return str.replace(/[^0-9a-zA-Z\.?&\/\+#=\-_:]/gi, '')
}
function validurlsimple(str){
    var pattern=new RegExp('^[a-z0-9\.?&\/\+#=\-_:]*$')
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
}
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}
function callbackClosure(i, callback) {
    return function() {
        return callback(i);
    }
}
