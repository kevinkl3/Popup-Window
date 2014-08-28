/*  Popup Window js 
|   Kevin Leonel López since 6/08/2014
|   kevinlopez@unitec.edu
*/
(function(root,factory){

    if(typeof define === 'function' && define.amd){
        define('PopupWindow',['jquery'],factory);
    }else if (typeof exports != 'undefined'){
    
        exports.PopupWindow = factory( (root.jQuery || root.$) );
    }else if(typeof require != "undefined" && require.register){

        require.register("kevinkl3/popupwindow", function(exports, require, module) {
            module.exports = factory(root.jQuery || root.$);
        });

    }else{
        root.PopupWindow = factory( (root.jQuery || root.$) );
    }

})(this, function( $ ){
    var PopupWindow = function (options){
        if(this == PopupWindow) return new PopupWindow(options);
        var defaults = {
            title: '-',
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
            container: null,
            constrainToContainer: false
        };
        options = $.extend(defaults,options);
        this.version = 'v0.1';
        var t = this;
        this.onMouseMove = function(e){
            if (window.getSelection) { window.getSelection().removeAllRanges(); }
            var pX = this.cx + e.clientX - this.offsetX;
            var pY = this.cy + e.clientY - this.offsetY;
            if (options.constrainToContainer && t.bounds) {
              pX = Math.min(Math.max(pX, t.bounds.left), t.bounds.right);
              pY = Math.min(Math.max(pY, t.bounds.top), t.bounds.bottom);
            }
            t.jel.css('left', pX);
            t.jel.css('top', pY);
        };
        
        
        this.close = function(){
            t.jel.trigger('closePopup').remove();
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

        this.refreshBounds = function() {
          if (t.container) {
            t.bounds = {
              top: t.container.offset().top,
              left: t.container.offset().left,
              bottom: t.container.offset().top + t.container.height() - t.jel.height(),
              right: t.container.offset().left + t.container.width() - t.jel.width(),
            };
          }
        };
        /* MAIN SETUP*/
        this.jel = $('<div></div>');
        this.el = this.jel[0];
        var pop = this.jel;
        this.titleDiv = $('<div></div>');
        this.closeBtn = $('<a href="#"></a>');
        this.contentDiv = $('<div></div>');
        if (options.container) {
          this.container = options.container.jquery ? options.container :
            $(options.container);
        }

        (this.container || $('body')).append(this.el);
        
        var titleDiv = this.titleDiv;
        var contentDiv = this.contentDiv;
        
        /*Setup Popup Window*/
        pop.addClass('PopupWindow');
        pop.addClass(options.theme);
        pop.css('position',options.fixed ? 'fixed' : 'absolute');

        pop.css('width',options.width);
        pop.css('height',options.height);
        pop.css('z-index',options.initialZIndex);

        var pX = options.position.x;
        var pY = options.position.y;
        if (t.container && options.constrainToContainer) {
          t.refreshBounds();
          pX = Math.min(Math.max(pX, t.bounds.left), t.bounds.right);
          pY = Math.min(Math.max(pY, t.bounds.top), t.bounds.bottom);
          console.log(pX, pY, t.bounds);
        } 

        pop.css('top',pY);
        pop.css('left',pX);
        
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
            t.jel.css('z-index', PopupWindow.zi++);
            t.offsetX = e.clientX;
            t.offsetY = e.clientY;
            t.cx = parseInt(t.jel.css('left'));
            t.cy = parseInt(t.jel.css('top'));
            t.refreshBounds();
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
            $(document).mouseup(function(){
              PopupWindow.current = null; 
              if (PopupWindow.doresize) { t.jel.trigger('resizePopup'); }
              PopupWindow.mousedown = false; 
              PopupWindow.doresize = false;
            });
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
    }

    return PopupWindow;
});
