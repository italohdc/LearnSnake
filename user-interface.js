var UserInterface = (function () {

    Snake.init();
    Snake.setup.keyboard(false);

    QLearning.run();
    QLearning.changeSpeed(4);
    QLearning.changeFPS(15);


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
