'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('Resources', {
    images:{
      babies:[
        'img/Baby1.png',
        'img/Baby2.png'
      ],
      floor: 'img/background.png',
      bottle: 'img/bottle.png'
    },
    text:{
      gameName:'Baby, Boomer',
      menuLinks:[
        {name:'Play', url:'#/game'},
        {name:'High Scores', url:'#/highscores'},
        {name:'Credits', url:'#/credits'}
      ],
      highScoreLinks:[
        {name:'Menu', url:'#/menu'}
      ],
      creditsLinks:[
        {name:'Menu', url:'#/menu'}
      ],
      credits:[
        {name:'Alex Toulan', role:'Lead Sr. Software Development Intern'},
        {name:'Colin Koponen-Robotham', role:'Lead Artistic Director'},
        {name:'Ellery Ross-Reid', role:'Lead Programmer'},
        {name:'Justin Ryder', role:'Lead Leader'}
      ]
    },
    creditsScrollSpeed: 50,
    creditsInterval: 50,
    babyAnimateSpeed: 200,
    babySize: 64,
    gameScreenSize:{
      width:600,
      height:800
    },
    floorLimit:{
      min:70,
      max:670
    },
    gameSpeed: 50,
    scoreSpeed: 1,
    obstacles:[
      {image:'img/boxes.png', size:{width:64, height:64}, canShoot:false},
      {image:'img/Pizza.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/Ham.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/cheese.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/Cheeseburger.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/Steak.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/HairySteak.png', size:{width:64, height:64}, canShoot:true},
      {image:'img/cart.png', size:{width:64, height:64}, canShoot:false},
      {image:'img/Blockershelf.png', size:{width:64, height:64}, canShoot:false},
      {image:'img/Blockershelf.png', size:{width:64, height:64}, canShoot:false},
      {image:'img/Blockershelf.png', size:{width:64, height:64}, canShoot:false},
      {image:'img/Blockershelf.png', size:{width:64, height:64}, canShoot:false}
    ],
    powerups: [
      {image:'img/milk.png', size:{width:64, height:64}, canShoot:false},
    ],
    bottleSpeed: -150,
    bottleSize: {width:64, height:64},
    crawlSpeed:100,
    obstacleSpawnRates:[3000, 5500, 5000, 4500, 3500, 2000, 2500],
    powerupSpawnRates:[15000, 20000, 25000]
  });