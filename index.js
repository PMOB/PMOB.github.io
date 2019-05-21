let width;
let height;
var scene;
var camera;
var renderer;
var controls;
var cubelist = [];
var movingon=0
// FIXME 変数名をどうにかしろ
var movingcounter=60;
var centering;
var defColor=0;
let colapse;
const countermax=200;
let r;

// FIXME
// 色
// スマホの時とか小さい画面のとき横が見切れるんじゃないか

// リンクページ
const content = {
    "P":"Programming",
    "M":"Mathematics",
    "O":"Organization",
    "B":"Belong"
};

const P=[
    [0,0],
    [0,1],
    [0,2],
    [0,3],
    [0,4],
    [0,5],

    [1,5],
    [2,5],
    [3,4],
    [3,3],
    [2,2],
    [1,2]
];

const M=[
    [0,0],
    [0,1],
    [0,2],
    [0,3],
    [0,4],
    [0,5],

    [1,4],
    [2,3],
    [3,4],

    [4,0],
    [4,1],
    [4,2],
    [4,3],
    [4,4],
    [4,5]
];

const O=[
    [0,1],
    [0,2],
    [0,3],
    [0,4],

    [1,5],
    [2,5],
    [3,3],
    [3,4],

    [3,2],
    [3,1],
    [2,0],
    [1,0]
];

const B=[
    [0,0],
    [0,1],
    [0,2],
    [0,3],
    [0,4],
    [0,5],

    [1,5],
    [2,5],
    [3,4],
    [2,3],
    [1,3],

    [3,2],
    [3,1],
    [2,0],
    [1,0]
];

const Pmob={"P":P,"M":M,"O":O,"B":B};


function windSize(){
    height = window.innerHeight-50;
    width = window.innerWidth-50;
}



function init(){
    windSize();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);
    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false;
    renderer = createRenderer();
    var now_total_wid = 0;
    var total_wid = -2;
    r = (width+50)/200;

    // 文字横全長
    Object.entries(Pmob).forEach((word)=>{
        total_wid += Math.max.apply([],word[1].map((array)=>{
            return array[0]
        }))+2;
    });
    centering = total_wid/2;

    // 命名が適切でない
    var id = 0;
    // キューブ作成配列にぶっこむ
    Object.entries(Pmob).forEach((word,index)=>{
        cubelist[index] = [];
        cubelist[index] = word[1].map((item)=>{
            return createCube(item[0], item[1], now_total_wid, id, word[0]);
        });
        id+=1;
        now_total_wid += Math.max.apply([],word[1].map((array)=>{
            return array[0]
        }))+2;
    });

    scene.add(createLight(0xFFFFFF, 0, 1000, 0));
    scene.add(createLight(0xFFFFFF, 500, 1000, 1000));
    scene.add(createLight(0xFFFFFF, -500, 1000, -1000));
    scene.add(createLight(0xFFFFFF, 0, 1000, 500));
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    update();
}



function createRenderer(){
    // trueにするとrenderが透明に出来るようになる
    const renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 0); //0:透明
    document.body.appendChild(renderer.domElement);
    return renderer;
}



function createCube(x, y, wid, id, belong){
    const geometry = new THREE.BoxGeometry(r, r, r);
    const material = new THREE.MeshPhongMaterial({color: 0xFF8000});
    const cube = new THREE.Mesh(geometry, material);
    cube.color = 1;
    cube.position.set(x*r+r*wid-centering*r, y*r, 0);
    cube.id = id;
    cube.belong = belong;
    scene.add(cube);
    return cube;
}



function cubecolorChange(obj){
    if(obj.color == 0) obj.material.color.setHex(0xBF4040);
    else obj.material.color.setHex(0xFF8000);
}



// function cubecoloriGradationChange(obj){
//     // obj.material.color.setHex(defColor+=9);
//     defColor = Math.floor(Math.random()*0xFFFFFF);
//     obj.material.color.setHex(defColor);
// }



function createLight(color, x, y, z){
    const light = new THREE.DirectionalLight(color);
    light.position.set(x, y, z);
    return light;
}


// ラピュタみたいな動き
function moving(obj){
    const xyzxyz = "xyzxyz";
    const zxyzxy = "zxyzxy";
    const yzxyzx = "yzxyzx";

    const index = [10,20,30,40,50,60,countermax].filter((i)=>{
        return movingcounter>i;
    }).length;
    let movin;

    if(index<6){
        movingon=1;
        if(obj.id%3==0){
            movin = xyzxyz[index];
        }else if(obj.id%3==1){
            movin = zxyzxy[index];
        }else{
            movin = yzxyzx[index];
        }

        const onestep = r/7;
        if(movin=="x"){
            (index<3)?
                obj.position.x += onestep : obj.position.x -= onestep;
        }else if(movin=="y"){
            (index<3)?
                obj.position.y += onestep : obj.position.y -= onestep;
        }else if(movin=="z"){
            (index<3)?
                obj.position.z += onestep : obj.position.z -= onestep;
        }
    }else movingon=0;
}



function update(){
    controls.update();
    requestAnimationFrame(update);
    renderer.render(scene, camera);

    movingcounter+=1;
    if(!colapse){
        (cubelist.flat()).forEach((o)=>{ moving(o) });
    }else{
        (cubelist.flat()).forEach((o)=>{
            if(o.belong != colapse){
                o.position.x += Math.floor(Math.random()*10);
                o.position.y += Math.floor(Math.random()*10);
                o.position.z += Math.floor(Math.random()*10);
                o.position.x -= Math.floor(Math.random()*10);
                o.position.y -= Math.floor(Math.random()*10);
                o.position.z -= Math.floor(Math.random()*10);
                o.position.z += 1;
            }else{ // こっちくんな こないで
                // o.position.z += 0.5;
            }
        });
    }
    if(movingcounter>=countermax){
        if(colapse) window.location.href = window.location.href + `pages/${colapse}.html`;
        movingcounter=0;
    }
    var projector = new THREE.Projector();
    var mouse = {x:0, y:0};

    // カオス
    window.onmousemove = function(ev){
        if(ev.target == renderer.domElement){
            var rect = ev.target.getBoundingClientRect();
            mouse.x =  ev.clientX - rect.left;
            mouse.y =  ev.clientY - rect.top;
            mouse.x =  (mouse.x / width) * 2 - 1;
            mouse.y = -(mouse.y / height) * 2 + 1;
            var vector = new THREE.Vector3(mouse.x, mouse.y ,1);
            projector.unprojectVector(vector, camera);
            var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            var obj = ray.intersectObjects(cubelist.flat());
            if(obj.length > 0){
                if(!colapse) document.getElementById("logo").textContent = `${content[obj[0].object.belong]}`;
                var save = obj[0].object.belong;
                (cubelist.flat()).forEach((o)=>{
                    if(o.belong == obj[0].object.belong){
                        o.color=0;
                        cubecolorChange(o);
                    }
                });
            }else{
                (cubelist.flat()).forEach((o)=>{
                    o.color=1;
                    cubecolorChange(o);
                });
                if(!colapse) document.getElementById("logo").textContent = "";
            }
        }
        window.onmousedown = function(e){
            if(e.target == renderer.domElement){
                if(!movingon && obj.length > 0){
                    (cubelist.flat()).forEach((o)=>{
                        if(o.belong == obj[0].object.belong){
                            o.color=1;
                            cubecolorChange(o);
                            colapse = obj[0].object.belong;
                            movingcounter=60;
                        }
                    });
                }
            }
        };
    };
}



window.addEventListener('DOMContentLoaded', init);
