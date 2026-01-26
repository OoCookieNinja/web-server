/** 
 *  MovingObjects Script LIBRARY by Virtual_Max (http://come.to/vmax)
 *  This script can be used and modified absolutely free
 *  untill this statement presents unchanged in all copies
 *  and derivatives.
 **/


allChips = new Array();

function makeChip(named,w,h,imagen,href,target,move)
 {this.named=named;
  this.w=w;
  this.h=h;
  this.xx=0;
  this.yy=0;
  this.zz=0
  this.vx=0;
  this.vy=0;
  this.vz=0;
  this.zzmax=10;
  this.timer=null;
  this.im     = new Image();
  this.im.src =imagen;
  this.imagen =imagen;
  this.complete=false;
  //if(href==null) href='Javascript:void(0);';
  this.href=href;
  if(target==null) target="_self";
  this.target=target;
  this.move=move;
  this.lastw=-1;
  this.lasth=-1;
  this.move3D=false;
  var s;
  s='<style type="text/css">';
  s+='#'+named+'{position:absolute; width:'+w+'; height:'+h+'; top:'+this.yy+'; left:'+this.xx+'; visibility:hidden; }';
  s+='</style>';
  document.writeln(s);
  s='<div ID="'+named+'">';
  if(this.href!=null) s+='<A HREF="'+this.href+'" TARGET="'+this.target+'">'
  s+='<IMG SRC="'+this.imagen+'" border=0 SUPPRESS>'
  if(this.href!=null) s+='</A>';
  s+='</div>';
  document.writeln(s);
 }

function moveChip(chipn)
 {
  var chip=allChips[chipn];
  if(document.layers) 
    {d=document[chip.named];
     d.left=Math.floor(chip.xx);
     d.top=Math.floor(chip.yy);
    }
  if(document.all)                
    {d=document.all[chip.named].style;
     d.pixelLeft=chip.xx;
     d.pixelTop=chip.yy;
    }
 }

function rescaleChip(chipn)
  {chip=allChips[chipn];
   var w=Math.floor(chip.zz);
   if(w==chip.lastw) return;
   chip.lastw=w;
   if(document.layers)
    {var s='';
     if(chip.href!=null)  s+='<A HREF="'+chip.href+'" TARGET="'+chip.target+'">';
     s+='<IMG border=0 width='+w+' height='+chip.im.height*w/chip.im.width+' SUPPRESS>';
     if(chip.href!=null)  s+='</A>';
     d=document[chip.named].document;
     d.open();
     d.writeln(s);
     d.close();
     d.images[0].src=chip.im.src;
    }
   if(document.all)
    {var s='';
     if(chip.href!=null) s+='<A HREF="'+chip.href+'" TARGET="'+chip.target+'">';
     s+='<IMG SRC="'+chip.imagen+'" border=0 width='+w+'>';
     if(chip.href!=null) s+='</A>';
     d=document.all[chip.named];
     d.innerHTML = s;
    }
  }

function visibilityChip(chipn,vis)
 {var chipname=allChips[chipn].named;
  if(document.all)
   {dddd=document.all[chipname].style;
    dddd.visibility = vis ? "visible":"hidden";
   }
  if(document.layers)
   {dddd=document[chipname];
    dddd.visibility = vis ? "show":"hide";
   }
 }


var pageX=0;
var pageY=0;
var pageW=600;
var pageH=400;

function getPageSizes()
{if(document.layers)
    {pageX=window.pageXOffset;
     pageW=window.innerWidth;
     pageY=window.pageYOffset;
     pageH=window.innerHeight;
    }
 if(document.all)
    {pageX=window.document.body.scrollLeft;
     pageW=window.document.body.offsetWidth;
     pageY=window.document.body.scrollTop;
     pageH=window.document.body.offsetHeight;
    } 
}

// -- random move parameters --
var vmin=2;
var vmax=5;
var vr=2;


function chipStarMove(chipn)
{
  chip = allChips[chipn];
  if(!chip.complete)
      {//if(chip.im.complete)
        {chip.complete=true;
         chip.xx = pageX+pageW/2; 
         chip.yy = pageY+pageH/2; 
         chip.vx=vr*(Math.random()-0.5)*2;
         chip.vy=vr*(Math.random()-0.5)*2;
         chip.w=chip.im.width;
         chip.h=chip.im.height;
         chip.zz=1;
         chip.zzmax=chip.w*(1-0.5*Math.random());
         visibilityChip(chipn,true);
        }
      }

   chip.xx=chip.xx+chip.vx;
   chip.yy=chip.yy+chip.vy;
   chip.vx*=(1.05);
   chip.vy*=(1.05);

   var dx = chip.xx-(pageX+pageW/2);
   var dy = chip.yy-(pageY+pageH/2);
   var r=Math.sqrt(dx*dx+dy*dy);
   var r0=Math.sqrt(pageW*pageW+pageH*pageH)/4;
   chip.zz=chip.zzmax*r/r0+1;

   if((chip.xx<=pageX-chip.w)||
      (chip.xx>=pageX+pageW) ||
      (chip.yy<=pageY-chip.h)||
      (chip.yy>=pageY+pageH)
     )
       {chip.complete=false}
  
}



function chipRandomMove(chipn)
{  
   chip = allChips[chipn];
 
   chip.vx+=vr*(Math.random()-0.5);
   chip.vy+=vr*(Math.random()-0.5);
   chip.vz+=vr*(Math.random()-0.5);
   if(chip.vx>(vmax+vmin))  chip.vx=(vmax+vmin)*2-chip.vx;
   if(chip.vx<(-vmax-vmin)) chip.vx=(-vmax-vmin)*2-chip.vx;
   if(chip.vy>(vmax+vmin))  chip.vy=(vmax+vmin)*2-chip.vy;
   if(chip.vy<(-vmax-vmin)) chip.vy=(-vmax-vmin)*2-chip.vy;
   if(chip.vz>(vmax+vmin))  chip.vz=(vmax+vmin)*2-chip.vz;
   if(chip.vz<(-vmax-vmin)) chip.vz=(-vmax-vmin)*2-chip.vz;

   chip.xx=chip.xx+chip.vx;
   chip.yy=chip.yy+chip.vy;
   chip.zz=chip.zz+chip.vz/4;

   if(!chip.complete)
      {//if(chip.im.complete)
        {chip.complete=true;
         chip.xx = Math.random()* pageW; 
         chip.yy = Math.random()* pageH; 
         chip.zzmax=chip.im.width;
         chip.zz=chip.zzmax;
         visibilityChip(chipn,true);
        }
      }

   if(chip.xx<=pageX)
     {chip.xx=pageX;
      chip.vx=vmin+vmax*Math.random();
     }
   if(chip.xx>=pageX+pageW-chip.w)
     {chip.xx=pageX+pageW-chip.w;
      chip.vx=-vmin-vmax*Math.random();
     }
   if(chip.yy>=pageY+pageH-chip.h)
     {chip.yy=pageY+pageH-chip.h;
      chip.vy=-vmin-vmax*Math.random();
     }
   if(chip.yy<=pageY)
     {chip.yy=pageY;
      chip.vy=vmin+vmax*Math.random();
     }


   if(chip.zz>=chip.zzmax)
     {chip.zz=chip.zzmax;
      chip.vz=-vmin-vmax*Math.random();
     }
   if(chip.zz<=1)
     {chip.zz=1;
      chip.vz=vmin+vmax*Math.random();
     }
}

var allChipsTimer=null;

function fixNNbug()
 {stopThemAll();
  window.location=location+"";
 }

var oldonload=null;

function runThemAll()
{if(document.layers)
   {window.onresize=fixNNbug;}
 setTimeout("runThemAll2()",300);
}


function runThemAll2()
{
 getPageSizes();
 if(pageH>0)
  {for(var i=0;i<allChips.length;i++)
        {if(allChips[i].move3D) {rescaleChip(i);}
         allChips[i].move(i);
         moveChip(i);
        }
  }
 setTimeout("runThemAll2()",100);
}

function stopThemAll()
{if(allChipsTimer!=null)
    {clearTimeout(allChipsTimer);}
}


function createRandomChips()
{if(document.layers || document.all)
 {var move3D=createRandomChips.arguments[0];
  var thelength = createRandomChips.arguments.length;
  for (var i = 1; i < thelength; i+=2)   
    {var im = createRandomChips.arguments[i];
     var lnk= createRandomChips.arguments[i+1];
     n=allChips.length;
     allChips[n] = new makeChip('rnd'+i,20,20,im,lnk,'_self',chipRandomMove);
     allChips[n].move3D=move3D;
    } 
 }
}

function createStarChips()
{var move3D=createStarChips.arguments[0];
 if(document.layers || document.all)
 {var thelength = createStarChips.arguments.length;
  for (var i = 1; i < thelength; i+=2)   
    {var im = createStarChips.arguments[i];
     var lnk= createStarChips.arguments[i+1];
     n=allChips.length;
     allChips[n] = new makeChip('star'+i,20,20,im,lnk,'_self',chipStarMove);
     allChips[n].move3D=move3D;
    } 
 }
}

