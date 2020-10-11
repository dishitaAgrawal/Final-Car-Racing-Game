class Game {
  constructor(){

    this.image = loadImage("images/background.jpeg");

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car2 = createSprite(300,200);
    car3 = createSprite(500,200);
    car4 = createSprite(700,200);

    car1.addImage("car1", car1_img);
    car2.addImage("car2", car2_img);
    car3.addImage("car3", car3_img);
    car4.addImage("car4", car4_img);

    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      //var display_position = 100;
      background(ground_img);
      image(track_img, 0, -displayHeight*4, displayWidth, displayHeight*5);
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 170;
      var y;


      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y

          fill("yellow");
          textSize(23);
          text(allPlayers[plr].name ,x-35,y+70);

        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=50
      player.update();
      console.log(player.distance);
    }

    if(player.distance > 3680) {

      gameState = 2;

      player.rank = player.rank+1;
      player.updateCarsAtEnd(player.rank);
      player.update();

    }

    drawSprites();
  }

  end() {

   // console.log("Game Ended");
   // console.log(player.rank);

  }

  showLeaderBoard() {
    background(this.image);
    var leaderBoard = createElement("h1");
    leaderBoard.position(displayWidth/2, 50);
    leaderBoard.html("Leaderboard");
    leaderBoard.style("color", 'yellow');

    var ranks=[];

    for(var p in allPlayers) {

      ranks.push({name: allPlayers[p].name, rank: allPlayers[p].rank});

    }

    var y = 200;
    for(var r in ranks) {
      var title = createElement("h2");
      title.position(displayWidth/2, y);
      title.style("color", 'white');
      y = y + 100;
      ranks.sort(function(a, b){return a.rank - b.rank});
      console.log(ranks);
      
      title.html(ranks[r].name + " : " + ranks[r].rank);
     

    }

  }
}
