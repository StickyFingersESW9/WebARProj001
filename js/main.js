// ページの読み込みを待つ
window.addEventListener( 'load', init );


var video;
var videoImage;
var videoTexture;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var camvideo = document.getElementById( 'monitor' );
if (!navigator.getUserMedia) 
{
  document.getElementById('errorMessage').innerHTML = 
    'Sorry. <code>navigator.getUserMedia()</code> is not available.';
}
else
{
  // フロント.
  //var media = { audio : false, video : { facingMode: "user" } };
  // リア.
  var media = { audio : false, video : { facingMode: { exact: "environment" } } };
  navigator.getUserMedia( media, gotStream, noStream);
}

function gotStream(stream) 
{
  if ( window.URL )
  {
    camvideo.src = window.URL.createObjectURL( stream );
  }
  else // Opera
  {
    camvideo.src = stream;
  }

  camvideo.onerror = function(e) 
  {
    stream.stop();
  };

  stream.onended = noStream;
}

function noStream(e) 
{
  var msg = 'No camera available.';
  if (e.code == 1) 
  {
    msg = 'User denied access to use camera.';
  }
  document.getElementById('errorMessage').textContent = msg;
}


function init() {

  var isSmartPhone = false;

  var ua = navigator.userAgent;
  if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
      isSmartPhone = true;
  }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
      isSmartPhone = true;
  }

  // ポリフィルを使用
  const polyfill = new WebVRPolyfill();

  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  var renderer = new THREE.WebGLRenderer(
    {
      canvas: document.querySelector( '#myCanvas' ),
      antialias: true,
      alpha: true
    }
  );
  renderer.setClearAlpha( 0.0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( width, height );


  // レンダラーのWebVR設定を有効にする
  //renderer.vr.enabled = true;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 45, width / height );
  camera.position.set( 0, 0, 0 );

  video = document.getElementById( 'monitor' );
  video.play();

  videoImage = document.getElementById( 'videoImage' );
  videoImage.style.width = window.innerWidth;
  videoImage.style.height = window.innerHeight;
  videoImageContext = videoImage.getContext( '2d' );
  // background color if no video present
  videoImageContext.fillStyle = '#000000';
  videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
  console.log( "videoImage.width=" + videoImage.width );
  console.log( "videoImage.height=" + videoImage.height );

  videoTexture = new THREE.Texture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;


/*
  // 再奥背景
  var planeGeometry = new THREE.PlaneGeometry( width, height, 0 );
  var planeMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  scene.add( plane );
*/



  // 箱を作成
  const geometry = new THREE.BoxGeometry( 400, 400, 400 );
  const material = new THREE.MeshNormalMaterial();
  const box = new THREE.Mesh( geometry, material );
  //scene.add( box );


  const stumpPath = [
    'imgs/baseball_dome.png',
    'imgs/cheerleader_woman.png',
    'imgs/enjin_sports_man.png',
    'imgs/sport_volleyball.png',
    'imgs/sports_ouen.png',
    'imgs/sports_volleyball_man_atack.png',
    'imgs/trophy_girl.png',
  ];

/*
  const count = 6;
  const distance = 100;
  for ( var i = 0 ; i < count ; ++i )
  {
    var stamp = CreatePolygon( new THREE.TextureLoader().load( stumpPath[i] ) );
    var angle = i * 360 / count;
    var x = distance * Math.cos( angle * (Math.PI / 180) );
    var z = distance * Math.sin( angle * (Math.PI / 180) );
    console.log( "angle=" + angle );
    console.log( "x=" + x + ", z=" + z );
    stamp.position.set( x, 0, z );
    scene.add( stamp );
  }
*/

    var stampAttay = [];
    var stamp00 = CreatePolygon( new THREE.TextureLoader().load( stumpPath[5] ) );
    stamp00.position.set( 0, 0, 1000 );
    stamp00.scale.set( 0.25, 0.25, 0.25 );
    scene.add( stamp00 );
    stampAttay.push( stamp00 );

    var stamp01 = CreatePolygon( new THREE.TextureLoader().load( stumpPath[3] ) );
    stamp01.position.set( 0, 0, -1000 );
    stamp01.rotation.set( 0, 180, 0 );
    stamp01.scale.set( 0.25, 0.25, 0.25 );
    scene.add( stamp01 );
    stampAttay.push( stamp01 );


  if( isSmartPhone )
  {
    var gcontrols = new THREE.DeviceOrientationControls( camera, renderer.domElement );
  }
  else
  {
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    requestAnimationFrame( tick );
    window.addEventListener( 'resize', onWindowResize, false );

    //box.rotation.y += 0.01;
    renderer.render( scene, camera ); // レンダリング

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
    {
      videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
      if ( videoTexture )
      {
        videoTexture.needsUpdate = true;
      }
    }

    if ( isSmartPhone )
    {
      gcontrols.connect();
      gcontrols.update();
    }
    else
    {
      box.rotation.y += 0.05 * Math.PI / 180;
      controls.update();
    }

    for ( let val of stampAttay ) {
      //val.rotation.setFromRotationMatrix( camera.matrix );
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    videoImage.style.width = window.innerWidth;
    videoImage.style.height = window.innerHeight;
  }
}



function CreatePolygon( texture )
{
  const width = 200;
  const height = 200;
  var planeGeometry = new THREE.PlaneGeometry( width, height, 0 );
  var planeMaterial = new THREE.MeshBasicMaterial( { map: texture, overdraw: true, side:THREE.DoubleSide } );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  return plane;
}
