let width;
let height;
var scene;
var camera;
var renderer;
var controls;
var cubelist = [];
var flag=0
// FIXME 変数名をどうにかしろ
var counter=60;
var centering;
var defColor=0;
let colapse;
const countermax=200;
const r = 5;

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
    renderer = createRenderer(width, height);
    var now_total_wid = 0;
    var total_wid = -2;

    // 文字横全長
    Object.entries(Pmob).forEach((word)=>{
        total_wid += Math.max.apply([],word[1].map((array)=>{return array[0]}))+2;
    })
    centering=total_wid/2;

    var id = 0;
    // キューブ作成配列にぶっこむ
    Object.entries(Pmob).forEach((word,index)=>{
        cubelist[index] = [];
        cubelist[index] = word[1].map((item)=>{
            return createCube(r,item[0],item[1],now_total_wid,id,word[0]);
        })
        id+=1;
        now_total_wid += Math.max.apply([],word[1].map((array)=>{return array[0]}))+2;
    })

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



function createRenderer(width, height){
    // trueにするとrenderが透明に出来るようになる
    var renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 0); //0:透明
    document.body.appendChild(renderer.domElement);
    return renderer;
}



function createCube(r,x,y,wid,id,belong){
    var geometry = new THREE.BoxGeometry(r, r, r);
    var material = new THREE.MeshPhongMaterial({color: 0xFF8000});
    var cube = new THREE.Mesh(geometry, material);
    cube.color = 1;
    cube.position.set(x*r+r*wid-centering*r, y*r, 0);
    cube.id = id;
    cube.belong = belong;
    scene.add(cube);
    return cube;
}



function cubecolorChange(obj){
    if(obj.color == 0) obj.material.color.setHex(0x353535);
    else obj.material.color.setHex(0xFF8000);
}



function cubecoloriGradationChange(obj){
    // obj.material.color.setHex(defColor+=9);
    defColor = Math.floor(Math.random()*0xFFFFFF);
    obj.material.color.setHex(defColor);
}



function createLight(color, x, y, z){
    var light = new THREE.DirectionalLight(color);
    light.position.set(x, y, z);
    return light;
}



function moving(obj){
    var xyzxyz="xyzxyz";
    var zxyzxy="zxyzxy";
    var yzxyzx="yzxyzx";

    var id = obj.id;
    var index=[10,20,30,40,50,60,countermax].filter((i)=>{
        return counter>i;
    }).length;
    var movin;

    if(index<6){
        if(id%3==0){
            movin=xyzxyz[index];
        }else if(id%3==1){
            movin=zxyzxy[index];
        }else{
            movin=yzxyzx[index];
        }

        if(movin=="x"){
            (index<3)?
                obj.position.x+=0.5:obj.position.x-=0.5;
        }else if(movin=="y"){
            (index<3)?
                obj.position.y+=0.5:obj.position.y-=0.5;
        }else if(movin=="z"){
            (index<3)?
                obj.position.z+=0.5:obj.position.z-=0.5;
        }
    }
}


function update(){
    controls.update();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
 
    counter+=1;
    if(!colapse){cubelist.forEach((o)=>{
        o.forEach((oo)=>{
            if(counter<10){
                oo.position.x += 0.1;
            }else if(counter<20){
                oo.position.y += 0.1;
            }else if(counter<30){
                oo.position.z -= 0.1;
            }else if(counter<40){
                oo.position.x -= 0.1;
            }else if(counter<50){
                oo.position.z += 0.1;
            }else if(counter<60){
                oo.position.y -= 0.1;
            }
            // if(counter%10==0) cubecoloriGradationChange(oo);
            // oo.rotation.x += 0.01;
            // oo.rotation.y += 0.01;
            // oo.rotation.z += 0.01;
            moving(oo);
        })
    })}else{
        (cubelist.flat()).forEach((o)=>{
            if(o.belong != colapse){
                o.position.x += Math.floor(Math.random()*10);
                o.position.y += Math.floor(Math.random()*10);
                o.position.z += Math.floor(Math.random()*10);
                o.position.x -= Math.floor(Math.random()*10);
                o.position.y -= Math.floor(Math.random()*10);
                o.position.z -= Math.floor(Math.random()*10);
                // o.position.x = 0;
                // o.position.y = 0;
                o.position.z += 1;
            }else{
                // o.position.z += 0.5;
            }
        })
    }
    if(counter>=countermax){
        window.location.href = window.location.href.replace("index.html",`pages/${colapse}.html`)
        counter=0;
        // cubelist.forEach((o)=>{
        //     o.forEach((oo)=>{
        //         oo.id=Math.floor(Math.random()*300);
        //     })
        // })
    }
    var projector = new THREE.Projector();
    var mouse = {x: 0, y: 0};
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
                document.getElementById("logo").textContent = `${content[obj[0].object.belong]}`;
            }else document.getElementById("logo").textContent = "";
        }
        window.onmousedown = function(e){
            if(e.target == renderer.domElement){
                if(obj.length > 0){
                    // obj[0].object.color=~obj[0].object.color&1;
                    // cubecolorChange(obj[0].object)
                    (cubelist.flat()).forEach((o)=>{
                        if(o.belong == obj[0].object.belong){
                            o.color=~o.color&1;
                            cubecolorChange(o);
                            colapse = obj[0].object.belong;
                            counter=0;
                        }
                    })
                }//else controls.autoRotate = !controls.autoRotate;
            }
        };
    }
}



window.addEventListener('DOMContentLoaded', init);
