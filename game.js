document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('stage');
    const startBtn = document.getElementById('startButton');
    const restartBtn = document.getElementById('restartButton');


    const windBlow = new Audio('sound/wind.wav');
    const playerHit = new Audio('sound/player-hit.wav');
    const zombieDead = new Audio('sound/zombie-dead.wav');
    


    let gameRun = false;
    let zombieInterval;
    let snowballInterval;
    let zombieSpeedInterval;
    let snowBallArray = [];
    let zombieArray = [];
    let zombieSpeed = 20;
    let zombieHealth = 75;
    let zombieSpawn = 5000;
    let snowballMagazine = 5;
    let isReloading = false; // Flag to check if reloading
    let keyBoardReaset = true;



    const scoreBoard = document.getElementById('score');
    const alex = {
        element: document.getElementById('alex'),
        positionY: 420, // Initial position
        maxHeight: 420,
        minHeight: 20,
        playerPosition: 0,
        attack: 25,
        amount: 5,
        score: 0,
        snowBallPosition: 510
        };

    startBtn.addEventListener('click', function() {
        startGame();
    });

    restartBtn.addEventListener('click', function() {
        restartgame();
    });

    function startGame() {
        
      windBlow.loop = true; // Set the loop property to true for continuous playback
      windBlow.play();

        document.getElementById('startButton').disabled = true;
        document.getElementById('restartButton').disabled = false;
        gameRun = true;

            function addNewZombie() {
                zombieHealth = zombieHealth +5;
                if(zombieSpeed > 5) {
                    zombieSpeed--;
                }
                if(zombieSpawn > 250) {
                    zombieSpawn -= 50;
                }
                // Create a random positionY between 0 and 8
                const timestamp = Date.now().toString(36);
                const positionY = Math.floor(Math.random() * 9);
        
                // Set random values for health and moveSpeed
        
                // Generate a unique ID for the zombie (you can use any method you prefer)
                const id = 'zombie-' + new Date().getTime();
        
                // Create the zombie element
                const newZombie = document.createElement('div');
        
                newZombie.className = 'zombie';
                newZombie.style.left = 1100 + 'px';
                newZombie.setAttribute('id', 'zombie' + timestamp);
                newZombie.style.bottom = positionY *50+20 + 'px';
                let zombie = {
                    zombieElement: 'zombie' + timestamp,
                    zombiePositionX: 1100,
                    snowballPositionY: positionY *50+20,
                    zombieHealth: zombieHealth,
                    zombieSpeed: zombieSpeed
                }
                
                zombieArray.push(zombie);
                
                // Append the zombie element to the container
                container.appendChild(newZombie);
                zombieInterval = setTimeout(addNewZombie, zombieSpawn); // 10000 milliseconds = 10 second
              }
          
              
              setTimeout(addNewZombie, 5000); // 10000 milliseconds = 10 second
                
                
        
        
                
        
                // Listen for key events
                if(keyBoardReaset) {
                    document.addEventListener('keyup', (event) => {
                            if (gameRun && (event.key === 'w' || event.key === 'W')) {
                              moveUp(alex);
                            } else if (gameRun && (event.key === 's' || event.key === 'S')) {
                              moveDown(alex);
                            } else if (gameRun && (event.key === ' ' || event.key === 'Spacebar')) {

                              if (!isReloading && snowballMagazine > 0) {
                                  createSnowball(alex);
                                  playSnowballSound();
                                  snowballMagazine--;
                            
                                  // If the magazine is empty, initiate a reload after 5 snowballs
                                  if (snowballMagazine === 0) {
                                    isReloading = true;
                                    setTimeout(() => {
                                      snowballMagazine = 5;
                                      isReloading = false;
                                    }, 700); // Reload time (adjust as needed)
                                  }
                                } 
                            }
                    });
                    keyBoardReaset = false;
                }
            
                function moveUp(player) {
                  if (player.positionY < player.maxHeight) {
                    player.positionY += 50; // Move up by 100 pixels
                    player.snowBallPosition +=50;
                    player.element.style.bottom = player.positionY + 'px';
                    player.playerPosition++;
                  }
                }
            
                function moveDown(player) {
                  if (player.positionY > player.minHeight) {
                    player.positionY -= 50; // Move down by 100 pixels
                    player.element.style.bottom = player.positionY + 'px';
                    player.snowBallPosition -=50;
                    player.playerPosition--;
                  }
                }
        
                function createSnowball(player) {
                    const timestamp = Date.now().toString(36)
                    const snowballElement = document.createElement('div');
                    snowballElement.className = 'snow-ball';
                    snowballElement.style.left = 150 + 'px';
                    snowballElement.setAttribute('id', 'snowball' + timestamp);
                    snowballElement.style.bottom = player.snowBallPosition + 'px';
                    let snowball = {
                        snowballElement: 'snowball' + timestamp,
                        snowballPositionArray : player.playerPosition,
                        snowballPositionX: 150,
                        snowballPositionY: player.snowBallPosition,
                        snowballDamage: Math.floor(Math.random() * (35 - 20 + 1)) + 20
                    }
                    
                    snowBallArray.push(snowball);
                    // Append the snowball to the snowball container
                    container.appendChild(snowballElement);
                    
                  }
        
                  function sbowballLoop() {
                    // Your code to be executed in the loop goes here
                    checkSbowBall();
                    snowballInterval = setTimeout(sbowballLoop, 5); // Repeat the function after a 10-millisecond delay
                  }
                  
                  // Start the loop
                  sbowballLoop();
                  
                  function checkSbowBall() {
                    if(snowBallArray[0]){
                        for(let i=0; i < snowBallArray.length; i++) {
                            const zombies = document.querySelectorAll('.zombie');
                            const snowballElement = document.getElementById(snowBallArray[i].snowballElement);
                            const snowballRect = snowballElement.getBoundingClientRect();
                            snowBallArray[i].snowballPositionX++;
                            
                            snowballElement.style.left = snowBallArray[i].snowballPositionX + 'px';
                            if(snowBallArray[i].snowballPositionX > 1150) {
                                snowBallArray.splice(i, 1);
                                snowballElement.remove();
                            }

                            for(let j=0; j<zombieArray.length; j++){
                                const zombieElement = document.getElementById(zombieArray[j].zombieElement);
                                const zombieRect = zombieElement.getBoundingClientRect();
                                if (isColliding(snowballRect, zombieRect)) {
                                    // Collision detected, remove the snowball and zombie
                                    handleCollision(snowballRect, zombieRect,snowBallArray[i].snowballDamage);
                                    playSnowballHit();
                                    zombieArray[j].zombieHealth = zombieArray[j].zombieHealth- snowBallArray[i].snowballDamage;
                                    snowBallArray.splice(i, 1);
                                    snowballElement.remove();
                                    if(zombieArray[j].zombieHealth <= 0) {
                                        zombieArray.splice(j, 1);
                                        zombieElement.remove();
                                        zombieDead.play();
                                        scoreBoard.innerHTML = (alex.score +=5);
                                    }
                                    }       
                            }
                        }
                    }
                  }
        
                  function isColliding(rect1, rect2) {
                    return (
                      rect1.left < rect2.right &&
                      rect1.right > rect2.left &&
                      rect1.top < rect2.bottom &&
                      rect1.bottom > rect2.top
                    );
                  }
        
                  function handleCollision(snowball, zombie, damage) { 
                    const collisionX = (snowball.left + zombie.right) / 2;
                    const collisionY = (snowball.bottom + zombie.top) / 2; 
                    const collisionDiv = document.createElement('div');
                    collisionDiv.className = 'damage-style'
                    collisionDiv.style.position = 'absolute';
                    collisionDiv.style.left = `${collisionX}px`;
                    collisionDiv.style.top = `${collisionY}px`;
                    collisionDiv.style.transform = 'translateY(0)'; // Start position
                    collisionDiv.textContent = damage;
        
                    collisionDiv.style.transition = 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out';
                    collisionDiv.style.transform = 'translateY(0)'; // Start position
        
                    document.body.appendChild(collisionDiv);
        
                    void collisionDiv.offsetWidth;
        
                    // Gradually decrease the opacity and remove the div
        
                    setTimeout(() => {
                        collisionDiv.style.opacity = '0'; // Start the fade-out effect
                        collisionDiv.style.transform = 'translateY(-100px)'; // Move upward by 100 pixels
                    
                        // Remove the div from the DOM and memory after the fade-out
                        setTimeout(() => {
                          collisionDiv.remove();
                        }, 1500); // Adjust the delay based on your desired fade-out duration
                      }, 0); // No initial delay
        
                  }
        
                  function zombieLoop() {
                    // Your code to be executed in the loop goes here
                    moveZombie();
                    zombieSpeedInterval = setTimeout(zombieLoop, zombieSpeed); // Repeat the function after a 10-millisecond delay
                  }
        
                  zombieLoop();
        
                  function moveZombie(){
                    for(let i=0; i<zombieArray.length; i++){
                        const zombieElement = document.getElementById(zombieArray[i].zombieElement);
                        zombieArray[i].zombiePositionX--;
                        if(zombieElement){
                            zombieElement.style.left = zombieArray[i].zombiePositionX + 'px';
                        }
                        if(zombieArray[i].zombiePositionX < 20) {
                            zombieArray.splice(i, 1);
                            zombieElement.remove();
                            gameover();
                        }
        
                    }
                  }
    }
    
    function restartgame() {
        document.getElementById('startButton').disabled = false;
        document.getElementById('restartButton').disabled = true;
        clearTimeout(zombieInterval);
        clearTimeout(snowballInterval);
        clearTimeout(zombieSpeedInterval);      
        zombieInterval = false;
        alex.positionY = 420;
        alex.element.style.bottom = '420px';
        alex.snowBallPosition = 510;
        gameRun = false;
        zombieSpeed = 20;
        zombieHealth = 75;
        zombieSpawn = 5000;
        snowballMagazine = 5;
        alex.score = 0;
        removeZombies();
        removeSnowballs();
        windBlow.pause();
      }
    

      function removeZombies() {
        const zombies = document.querySelectorAll('.zombie');
        zombies.forEach(zombie => zombie.remove());
        zombieArray = [];
        
    }
    
    function removeSnowballs() {
        const snowballs = document.querySelectorAll('.snow-ball');
        snowballs.forEach(snowball => snowball.remove());
        snowBallArray = [];
      }

    function gameover(){
      playerHit.play();
      clearTimeout(zombieInterval);
      clearTimeout(snowballInterval);
      clearTimeout(zombieSpeedInterval);      
      zombieInterval = false;
      gameRun = false;
      windBlow.pause();
    }
    
    function playSnowballSound() {
      ballThrow = new Audio('sound/throw.mp3');
      ballThrow.play();
    }

    function playSnowballHit() {
      ballHit = new Audio('sound/snow-hit.mp3');
      ballHit.play();
    }

});


