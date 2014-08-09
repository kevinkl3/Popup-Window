/*  Popup Window js 
|   Kevin Leonel López since 6/08/2014
|   kevinlopez@unitec.edu
*/

function PopupWindow (options){
    var defaults = {
        title: '',
        width: 500,
        height: 300,
        resizable: true,
        content: '',
        position:{
            x: 600,
            y: 300,
        },
        style: {

        },
        attrs:{

        },
        class: '',
        fixed: true,
        theme: 'dark',
        titleHeight: 30,
        minWidth: 300,
        minHeight: 100,
        initialZIndex: 1100,
    };
    options = $.extend(defaults,options);
    var t = this;
    this.onMouseMove = function(e){
        //console.log(arguments);
        t.jel.css('left', this.cx + e.clientX - this.offsetX);
        t.jel.css('top', this.cy + e.clientY - this.offsetY);
    };
    
    
    this.close = function(){
        t.jel.remove();
    };
    
    this.onResize = function(e){
        if(e.clientX - t.cx >= options.minWidth){
            t.jel.css('width',  e.clientX - t.cx);
           // t.contentDiv.css('width',  e.clientX - t.cx);
        }
                
        if(e.clientY - t.cy >= options.minHeight){
            t.jel.css('height', e.clientY - t.cy);
            //t.contentDiv.css('height',e.clientY - t.cy - options.titleHeight)
        }
    };
    
    this.getContentDiv = function(){return t.contentDiv;};
    /* MAIN SETUP*/
    this.jel = $('<div></div>');
    this.el = this.jel[0];
    var pop = this.jel;
    this.titleDiv = $('<div></div>');
    this.closeBtn = $('<a href="#"></a>');
    this.contentDiv = $('<div></div>');
    
    var titleDiv = this.titleDiv;
    var contentDiv = this.contentDiv;
    
    /*Setup Popup Window*/
    pop.addClass('PopupWindow');
    pop.addClass(options.theme);
    pop.css('position',options.fixed ? 'fixed' : 'absolute');
    pop.css('width',options.width);
    pop.css('height',options.height);
    pop.css('top',options.position.y);
    pop.css('left',options.position.x);
    pop.css('z-index',options.initialZIndex);
    
    $.each(options.style,function(k,v){
        pop.css(k,v);
    });

    $.each(options.attrs,function(k,v){
        pop.attr(k,v);
    });
    
    pop.addClass(options.class);
    /*Setup inside elements*/
    titleDiv.addClass('PopupWindow-Title');
    titleDiv.addClass(options.theme)
    titleDiv.html(options.title);
    titleDiv.css('height',options.titleHeight);
    
    this.closeBtn.css('float','right');
    this.closeBtn.click(t.close);
    this.closeBtn.addClass('close-button');
    
    contentDiv.addClass('PopupWindow-Content');
    contentDiv.addClass(options.theme);
    //contentDiv.css('width',options.width);
    //contentDiv.css('height', (options.height - options.titleHeight) + 'px');
    contentDiv.html(options.content);

    titleDiv.append(this.closeBtn);
    /*Append To PopupWindow*/
    if(options.title.length > 0)
        pop.append(titleDiv);
    
    pop.append(contentDiv);
    
    /*bind events*/
    titleDiv.mousedown(function(e){
        if(PopupWindow.mousedown || e.button == 2)return;
        t.jel.css('z-index',PopupWindow.zi++);
        t.offsetX = e.clientX;
        t.offsetY = e.clientY;
        t.cx = parseInt(t.jel.css('left'));
        t.cy = parseInt(t.jel.css('top'));
        PopupWindow.current = t; 
        PopupWindow.mousedown = true;
    });
    
    contentDiv.click(function(){
        t.jel.css('z-index',PopupWindow.zi++);
    });
    
    titleDiv.mouseup(function(){
        PopupWindow.current = null;
        PopupWindow.mousedown = false;
    });
    
    if(!PopupWindow.binded){
        PopupWindow.binded = true;
        $(document).mousemove(function(){
            if(PopupWindow.mousedown ||  PopupWindow.current != null || PopupWindow.resize != null || PopupWindow.doresize){
                if(PopupWindow.mousedown){
                    PopupWindow.current.onMouseMove.apply(PopupWindow.current,arguments);
                }else if(PopupWindow.doresize){
                    PopupWindow.resize.onResize.apply(PopupWindow.current,arguments);
                }
                return false;
            }else{
                return true;
            }
        });
        $(document).mouseup(function(){PopupWindow.current = null; PopupWindow.mousedown = false; PopupWindow.doresize = false;});
        PopupWindow.zi = options.initialZIndex;
    }else{
        t.jel.css('z-index',PopupWindow.zi++);
    }
    
    /*Resize*/
    if(options.resizable){
        this.resizeLb = $('<div></div>');
        this.resizeLb.css('position','absolute');
        this.resizeLb.css('bottom','0');
        this.resizeLb.css('right','0');
        this.resizeLb.css('width','10px');
        this.resizeLb.css('height','10px');
        this.resizeLb.css('cursor','se-resize');
        this.contentDiv.append(this.resizeLb);
        pop.css('resize','both');
        
        this.resizeLb.mousedown(function(e){
            if(PopupWindow.doresize || e.button == 2)return;
            t.jel.css('z-index',PopupWindow.zi++);
            PopupWindow.resize = t;
            PopupWindow.doresize = true;
            t.cx = parseInt(t.jel.css('left'));
            t.cy = parseInt(t.jel.css('top'));
        });
    }
    
    /*Append to Body*/
    $('body').append(this.el);
    console.log(this);
}
            
