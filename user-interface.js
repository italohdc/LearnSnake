var UserInterface = (function () {

    Snake.init();
    Snake.setup.keyboard(false);
    Snake.setup.wall(false);

    QLearning.run();
    QLearning.changeSpeed(4);
    QLearning.changeFPS(15);

    /// EASTER EGG ///
    document.addEventListener('keyup', KonamiCode);
    var konamiOrder = [38,38,40,40,37,39,37,39,66,65];
    var konamiIndex = 0;

    function KonamiCode (evt) {
        if(konamiOrder[konamiIndex] == evt.keyCode){
            konamiIndex++
            console.log('yeah');
        } 
        else {
            konamiIndex = 0;
            console.log('nope');
        }

        if (konamiIndex == konamiOrder.length) {
            document.removeEventListener('keyup', KonamiCode);
            QLearning.stop();
            Snake.setup.keyboard(true);
            Snake.setup.tileCount(20);
            Snake.setup.fixedTail(false);
            Snake.reset();
            Snake.start();
        }
    }
    ///

    var btnTrain = document.getElementById('btnTrain');
    btnTrain.addEventListener('click', speedFaster);

    var infoScore = document.getElementById('score');
    var infoMissed = document.getElementById('missed');

    var rangerLR = document.getElementById('rangeLR');
    var rangerDF = document.getElementById('rangeDF');
    var rangerRandom = document.getElementById('rangeRandom');

    setInterval(loop, 100);

    function loop () {
        infoScore.innerHTML = 'score: ' + QLearning.info.score();
        infoMissed.innerHTML = 'missed: ' + QLearning.info.missed();

        QLearning.changeConst.LearningRate(0.01*rangerLR.value);
        QLearning.changeConst.DiscountFactor(0.01*rangerDF.value);
        QLearning.changeConst.Randomization(0.01*rangerRandom.value);
    }
    
    function speedFaster () {
        QLearning.changeSpeed(1);
        btnTrain.innerHTML = '&#9646;&#9646; train';
        btnTrain.removeEventListener('click', speedFaster);
        btnTrain.addEventListener('click', speedSlower);
    };
    
    function speedSlower () {
        QLearning.changeFPS(15);
        btnTrain.innerHTML = '&#9654; train';
        btnTrain.removeEventListener('click', speedSlower);
        btnTrain.addEventListener('click', speedFaster);
    };

})();
