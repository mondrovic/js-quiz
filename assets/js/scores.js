var userScoresEl = document.getElementById("userScores");

// checks to see if the document is ready before running score fetch
var readyCheck = function(fn){

    if (document.readyState === 'complete') {
        return fn();
    }

    // Wait to see if document loads
    document.addEventListener('DOMContentLoaded', fn, false);
};

var scoreSorter = function(){

    var savedScores = JSON.parse(localStorage.getItem('highscores'));        

    // checks for values
    if (savedScores !== null) {
        // sort highscores in descending order
        savedScores.sort(function(score1, score2){
            var x = score1.highscore;
            var y = score2.highscore;

            if (x > y){
                return -1;
            }

            if (x < y){
                return 1;
            }

            return 0;
        });

        //clears out ordered list
        var orderedList = document.getElementById("userScores");
        orderedList.innerHTML = "";
        
        // inputs scores from local storage
        for (var i = 0; i < savedScores.length; i++) {

            var scoreEl = document.createElement("li");
            scoreEl.textContent = savedScores[i].initials +" "+ savedScores[i].highscore;                        
            userScoresEl.appendChild(scoreEl);
        }
    }
}

readyCheck(scoreSorter());

document.getElementById("btnBack").onclick = function (event){
    // sends us back to quiz
    document.location.href= "index.html";
}

document.getElementById("btnClear").onclick = function (event){
    // removes all items from localstorage
    localStorage.removeItem("highscores");
    //cleras all list items
    var orderedList = document.getElementById("userScores");
    orderedList.innerHTML = "";            
}