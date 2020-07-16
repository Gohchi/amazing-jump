import Phaser from 'phaser'
import Player from '../components/player'
import Background from '../components/background'
import Debug from '../components/debug'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game2Scene' })
  }
  preload ()
  {
    // //  Load sprite sheet generated with TexturePacker
    this.load.atlas('sheet', 'assets/physics/fruit-sprites.png', 'assets/physics/fruit-sprites.json');
    
    // //  Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/physics/fruit-shapes.json');
    this.load.image('blocks01-flooring', 'assets/material/blocks01-flooring.png');
    
    this.load.image('sidewalk', 'assets/bg/sidewalk.png');

    this.load.image('building01', 'assets/bg/building01.png');
    this.load.json('building-shapes', 'assets/bg/building-pe.json');


    Background.prepare( this );
    Player.prepare( this );
  }

  create ()
  {
    this.bg = new Background( this );
    this.shapes = {
      buildings: this.cache.json.get('building-shapes'),
      fruits: this.cache.json.get('shapes')
    };
    this.createGround();
    
    // create player
    this.player = new Player( this );
    
    // this.input.on('pointerdown', function (pointer)
    // {
    //     var fruit = Phaser.Utils.Array.GetRandom([ 'crate', 'banana', 'orange', 'cherries' ]);
    //     this.matter.add.image(pointer.x, pointer.y, 'sheet', fruit, { shape: this.shapes.fruits[fruit] });
    // }, this);

      // .setBody(shapes.banana)
    ;
    
    if(this.sys.game.config.physics.matter.debug){
      this.debugInfo = new Debug( this, 500, 200 );
      this.debugInfo
        .add(() => "Angle: " + Math.round(this.player.sprite.angle))
        .add(() => "On ground: " + this.player.playerOnGround)
        .add(() => "Vel X: " + Math.round(this.player.gameObject.body.velocity.x))
        .add(() => "Vel Y: " + Math.round(this.player.gameObject.body.velocity.y));
    }
    
    this.delayCall;
    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      // console.log('collisionstarts');
      let go = bodyA.gameObject;
      if(go.name){
        let tint = Math.random() * 0xffffff;
        go.setTint(tint);
        if(go.name == 'ground2'){
          go.setScale(Math.floor(Math.random() * 5) + 1, 1);
          // go.setAngle(go.angle+1);
          // go.setAngle(Math.floor(Math.random() * 360));

        }
      }
      clearTimeout(this.delayCall);
      this.delayCall = setTimeout(() => {
        // console.log('onGround');
        this.player.playerOnGround = true;
      }, 100);
    });
    
    this.gravityChanged = false;

    this.cameras.main
      .setBounds(0, 0, this.sys.game.config.maxWidth, this.sys.game.config.maxHeight);
      // .setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    this.cameras.main
      .startFollow(this.player.sprite);
  }

  update(){
    this.bg.update( this.player );

    //#region ground movement
    let fix = 450;
    let v = Math.floor( this.bg.tweens.getValue() * fix );
    this.ground2.y = v - fix*0.7 ;
    //#endregion

    if(this.sys.game.config.physics.matter.debug) this.debugInfo.update();
    
    this.player.update();
    this.debugInfo.text.x = this.player.sprite.x + 60;
    this.debugInfo.text.y = this.player.sprite.y - 30;
  }

  createGround(){
    const baseGround = 500;
    const blockName = 'blocks01-flooring';
    // this.matter.add
    //   .image(this.sys.game.config.width / 2, baseGround + 120, blockName, null, { isStatic: true, density: .5 }) //density: .5
    //   .setScale(8, 1)
    //   // .tint = Math.random() * 0xffffff;
    //   // .setAngle(10)
    //   .name = 'ground0'
    // ;
    // this.matter.add
    //   .image(150, baseGround-200, blockName, null, { isStatic: true })
    //   .setScale(4, 1)
    //   .setAngle(45)
    //   .name = 'ground1'
    // ;
    this.ground2 = this.matter.add
      .image(1200, baseGround, blockName, null, { isStatic: true })
      .setScale(4, 1);
    this.ground2
      .name = 'ground2';
      // .setAngle(-20)
    ;

    
    // this.matter.add
    //   .image(200, 300, blockName, null, { isStatic: true, density: .1 }) //density: .5
    //   .setScale(2, 1)
    //   // .setAngle(15)
    //   // .tint = Math.random() * 0xffffff;
    //   // .setAngle(10)
    //   .name = 'startfloor'
    // ;

    // this.matter.add
    //   .image(200, 600, 'building01', null, { isStatic: true, density: .1 }) //density: .5
    //   .setScale(0.4)
    //   .name = 'building01'
    // ;

    let sidewalk = this.add.tileSprite(
      /* x */ this.sys.game.config.maxWidth / 2, // fix: should be 0
      /* y */ this.sys.game.config.maxHeight - 65,
      /* w */ this.sys.game.config.maxWidth,
      /* h */ 125,
      'sidewalk'
    )
    .setOrigin(0, 0); // for some reason this prop is ignored in the gameObject

    this.matter.add
      .gameObject( sidewalk, {
        isStatic: true
      })

    const buildingName = 'building01';
    const buildingSprite = this.add.sprite(300, this.sys.game.config.maxHeight - 520, buildingName, 4)
      .setScale(0.4);
  
    this.matter.add
      .gameObject( buildingSprite, {
        shape: this.shapes.buildings[buildingName],
        restitution: .9
      });
  }
}