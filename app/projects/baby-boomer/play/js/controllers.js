'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services']).
  controller('MenuCtrl', ['$scope', 'Resources', function($scope, Resources) {
    $scope.gameName = Resources.text.gameName;
    $scope.links = [];
    TrickleArray(Resources.text.menuLinks, $scope.links, $scope);
  }])

  .controller('GameCtrl', ['$scope', '$location', 'Resources', function($scope, $location, Resources) {
    /* SCORE */
    $scope.score = 0;
	$scope.numBottles = 3;

    /* FLOOR */
    $scope.floor = new Floor($scope.floorImage, { x: 0, y: 0 }, Resources.crawlSpeed);
    $scope.backgroundStyle = function(){
      return {
        'background-position': $scope.floor.position.x + 'px ' + $scope.floor.position.y + 'px'
      };
    };

    $scope.aisleStyle = function(){
      return {
        'background-position': '-15px ' + $scope.floor.position.y + 'px'
      };
    };

    /* BABY */
    $scope.babyImage = Resources.images.babies[0];
    $scope.babyPosition = {x:500,y:636};
    $scope.babyStyle = function(){
      return {
        position: 'fixed',
        left: $scope.babyPosition.x + 'px',
        top: $scope.babyPosition.y + 'px',
        width: Resources.babySize + 'px',
        height: Resources.babySize + 'px'
      };
    };
    $scope.moveBaby = function($event) {
      var minX = Resources.floorLimit.min;
      var maxX = Resources.floorLimit.max;
      return $event.pageX < minX ? minX : $event.pageX > maxX ? maxX : $event.pageX;
    };

    var babyImageIndex = 0;
    var babyImageInterval = setInterval(function(){
      $scope.$apply(function(){
        babyImageIndex++;
        if (babyImageIndex > Resources.images.babies.length-1){
          babyImageIndex = 0;
        }
        $scope.babyImage = Resources.images.babies[babyImageIndex];
      });
    }, Resources.babyAnimateSpeed);

    /* BOTTLES */
    $scope.bottles = [];
    $scope.bottleImage = Resources.images.bottle;

    $scope.fireBottle = function(){
	  if($scope.numBottles > 0) {
		  var bottle = new Bottle($scope.babyPosition, Resources.bottleSpeed);
		  $scope.bottles.push(bottle);
		  $scope.numBottles--;
	  }
    };

    /* OBSTACLES */
    $scope.obstacles = [];

    $scope.spawnAtSlot = function(it) {

        var resourceObstacle = RandomItem(Resources.obstacles);
        var obstacle = new Obstacle(
          resourceObstacle,
          {
            x: (it * 64) + Resources.floorLimit.min + 54,
            y: -resourceObstacle.size.height
          },
          Resources.crawlSpeed
          );
        $scope.obstacles.push(obstacle);
    };

    $scope.spawnObstacleRow = function(min, max, gapWidth) {

      var gapStart = Random(max - gapWidth, min);
      var gapEnd = gapStart + gapWidth;

      for(var i = min; i < gapStart; i++) {
        $scope.spawnAtSlot(i);
      }
      for(var i = gapEnd; i < max; i++) {
        $scope.spawnAtSlot(i);
      }
    };

    var obstacleSpawnManagerInterval;
    function obstacleSpawnManager() {
      obstacleSpawnManagerInterval = setTimeout(function(){
        $scope.$apply(function(){
          $scope.spawnObstacleRow(0, 10, 2);
        });
        obstacleSpawnManager();
      }, RandomItem(Resources.obstacleSpawnRates));
    }
    // init the obstacle spawning random duration loop
    obstacleSpawnManager();

    /* POWERUPS */
    $scope.powerups = [];

    $scope.spawnPowerUpAtPosition = function(it) {

        var resourcePowerup = RandomItem(Resources.powerups);
        var powerup = new Powerup(
          resourcePowerup,
          {
            x: (Random(0,10) * 64) + Resources.floorLimit.min + 54,
            y: -resourcePowerup.size.height
          },
          Resources.crawlSpeed
          );
        $scope.powerups.push(powerup);
    };

    $scope.spawnPowerup = function() {
	  $scope.spawnPowerUpAtPosition();
    };

    var powerupSpawnManagerInterval;
    function powerupSpawnManager() {
      powerupSpawnManagerInterval = setTimeout(function(){
        $scope.$apply(function(){
          $scope.spawnPowerup();
        });
        powerupSpawnManager();
      }, RandomItem(Resources.powerupSpawnRates));
    }
    // init the powerup spawning random duration loop
    powerupSpawnManager();

    /* UPDATE */
    var updateInterval = setInterval(function() {
      $scope.$apply(function() {
        var deltaTime = Resources.gameSpeed * 0.001;

        $scope.floor.update(deltaTime);

        Enumerable.From($scope.bottles).ForEach(function(bottle){
          bottle.update(deltaTime);
        });

		var powerupsToRemove = [];
        Enumerable.From($scope.powerups).ForEach(function(powerup){
          powerup.update(deltaTime);
		  
		  if (AreColliding(powerup.position, powerup.size, $scope.babyPosition, {width:Resources.babySize, height:Resources.babySize})){
            $scope.numBottles++;
			powerupsToRemove.push($scope.powerups.indexOf(powerup));
            powerup.colliding = true;
            return;
          }
          else {
            powerup.colliding = false;
          }
        });

        var bottlesToRemove = [];
        var obstaclesToRemove = [];
        Enumerable.From($scope.obstacles).ForEach(function(obstacle){
          obstacle.update(deltaTime);

          // check for bottles hitting obstacles
          Enumerable.From($scope.bottles).ForEach(function(bottle){

            if (AreColliding(bottle.position, Resources.bottleSize, obstacle.position, obstacle.size)){

              var bottleIndex = $scope.bottles.indexOf(bottle);
              if (!Enumerable.From(bottlesToRemove).Any(function(b){b == bottleIndex})){

                bottlesToRemove.push(bottleIndex);
              }
              if (obstacle.canShoot){
                obstaclesToRemove.push($scope.obstacles.indexOf(obstacle));
              }
            }
          });
          
          if (AreColliding(obstacle.position, obstacle.size, $scope.babyPosition, {width:Resources.babySize, height:Resources.babySize})){
            $scope.endGame();
            obstacle.colliding = true;
            return;
          }
          else {
            obstacle.colliding = false;
          }

          if (obstacle.position.y > Resources.gameScreenSize.height){
            obstaclesToRemove.push($scope.obstacles.indexOf(obstacle));
          }
        });
        
        var numRemoved = 0;
        obstaclesToRemove.forEach(
          function(index) {
            $scope.obstacles.splice(index - numRemoved, 1);
            numRemoved++;
          });
        numRemoved = 0;
        bottlesToRemove.forEach(
          function(index) {
            $scope.bottles.splice(index - numRemoved, 1);
            numRemoved++;
          });
        numRemoved = 0;
        powerupsToRemove.forEach(
          function(index) {
            $scope.powerups.splice(index - numRemoved, 1);
            numRemoved++;
          });

        $scope.score += Resources.scoreSpeed;
      })
    }, Resources.gameSpeed);

    $scope.endGame = function(){
      $scope.obstacles = [];
	  $scope.powerups = [];
      clearInterval(updateInterval);
      clearInterval(babyImageInterval);
      clearTimeout(obstacleSpawnManagerInterval);
  	  var highScores = getHighScores();
  	  var newScore = prompt("What's your name?") + ':' + $scope.score;
  	  var newcookieval = readCookie('bb_newScore') !== undefined ? readCookie('bb_newScore') + "|" + newScore : newScore;
  	  createCookie('bb_newScore', newcookieval);
      $location.path('/highscores');
    };
  }])
	
  .controller('HighScoresCtrl', ['$scope', 'Resources', function($scope, Resources){
    var cookie = readCookie('bb_newScore') || '';
  	var allScores = cookie.split('|') == "" ? [] : cookie.split('|');
  	var highScores = [];
  	allScores.forEach(function(scoreItem) {
  		highScores.push({name: scoreItem.split(':')[0], score: scoreItem.split(':')[1]});
  	});
  	highScores.sort(sortHighScores);
    $scope.highScores = highScores.slice(0,10);
	$scope.links = Resources.text.highScoreLinks;
	$scope.highScoresPosition = Resources.gameScreenSize.height;
	$scope.maxHighScoresPosition = 320;
    var scrollingInterval = setInterval(function(){
      $scope.$apply(function(){
        var deltaTime = Resources.creditsInterval * 0.001;
        $scope.highScoresPosition -= Resources.creditsScrollSpeed * deltaTime;
        if ($scope.highScoresPosition < $scope.maxHighScoresPosition){
          clearInterval(scrollingInterval);
        }
      });
    }, Resources.creditsInterval);
  }])

  .controller('CreditsCtrl', ['$scope', '$location', 'Resources', function($scope, $location, Resources){
	$scope.links = Resources.text.creditsLinks;
    $scope.credits = Resources.text.credits;
    $scope.creditsPosition = Resources.gameScreenSize.height;
    var scrollingInterval = setInterval(function(){
      $scope.$apply(function(){
        var deltaTime = Resources.creditsInterval * 0.001;
        $scope.creditsPosition -= Resources.creditsScrollSpeed * deltaTime;
        if ($scope.creditsPosition < 0){
          clearInterval(scrollingInterval);
          $location.path('/menu');
        }
      });
    }, Resources.creditsInterval);
  }]);

function createCookie(name,value) {
	var expires = "; expires=Tue, 19 Jan 2038 03:14:07 GMT;";
	document.cookie = name+"="+value+expires+" path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return undefined;
}

function getHighScores() {
	var cookie = readCookie('bb_newScore') || '';
	var allScores = cookie.split('|');
	var highScores = [];
	allScores.forEach(function(scoreItem) {
		highScores.push(scoreItem.split(':')[1]);
	});
	highScores.sort(sortNumber);
	return highScores;
}

function sortNumber(a,b) {
    return b - a;
}

function sortHighScores(a,b) {
    return b.score - a.score;
}

function AreColliding(pos1, size1, pos2, size2){
  return !(pos2.x > pos1.x + size1.width || 
           pos2.x + size2.width < pos1.x || 
           pos2.y > pos1.y + size1.height ||
           pos2.y + size2.height < pos1.y);
}

function RandomItem(arr){
  return arr[Random(arr.length)];
}

function Random(max, min){
  min = min || 0;
  return Math.floor((Math.random() * (max - min)) + min);
}

function Bottle(position, speed) {
  var self = this;
  self.position = {x:position.x, y:position.y};
  self.speed = speed;
  self.update = function(deltaTime){
    self.position.y += speed * deltaTime;
  };
  self.style = function(){
    return {
      left: self.position.x + 'px',
      top: self.position.y + 'px'
    };
  };
  return self;
}

function Obstacle(obstacle, position, speed) {
  var self = this;
  self.image = obstacle.image;
  self.size = obstacle.size;
  self.position = position;
  self.canShoot = obstacle.canShoot;
  self.update = function(deltaTime){
    position.y += speed * deltaTime;
  };
  self.style = function(){
    return {
      left: -position.x * 0.5,
      top: -position.y * 0.5
    };
  };
  return self;
}

function Powerup(powerup, position, speed) {
  var self = this;
  self.image = powerup.image;
  self.size = powerup.size;
  self.position = position;
  self.canShoot = powerup.canShoot;
  self.update = function(deltaTime){
    position.y += speed * deltaTime;
  };
  self.style = function(){
    return {
      left: -position.x * 0.5,
      top: -position.y * 0.5
    };
  };
  return self;
}

function Floor(image, position, speed) {
  var self = this;
  self.image = image;
  self.position = position;
  self.speed = speed;
  self.update = function(deltaTime){
    position.y += speed * deltaTime;
  };
  return self;
}

function TrickleArray(source, destination, $scope, interval){
  interval = interval || 1000;
  var i = 0;
  var interval = setInterval(function(){
    $scope.$apply(function(){
      if(source[i] != undefined) { destination.push(source[i]) };
      i++;
      if (i >= source.length){
        clearInterval(interval);
        i = null;// helpin the GC? wtfjsidk
      }
    });
  }, interval);
}