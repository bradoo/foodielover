var food = {
    task_list: [],
    $form_add_task: $('.add-task'),
    $checkbox_checked:{},
    //初始化对象 并启动
    init: function (args) {
        store.clear();
        var data = args.food;
        this.listen_form_tabs_click();
        this.listen_task_add(data);
        this.task_list = store.get('task_list') || [];
        if (this.task_list.length) {
            this.render_task_list();
        }
    },
    //监听tab点击
    listen_form_tabs_click:function(){
        var $form_tabs_li=$('#tabs li');
        var $div=$('#tabs').children('div');
        for(var i=0;i<$form_tabs_li.length;i++){
            $form_tabs_li[i].index=i;
            $($form_tabs_li[i]).on('click',function(){
                for(var n=0;n<$form_tabs_li.length;n++){
                    $form_tabs_li[n].className="";
                    $($div[n]).addClass('hide');
                }
                $(this).addClass('on');
                $($div[this.index]).removeClass('hide');
            });
        }

    },
    //监听添加
    listen_task_add: function(data) {
        var that = this;
        this.$form_add_task.on('submit', function (e) {
            var new_task = {},
                content,
                $input;
            e.preventDefault();
            $input = $(this).find('input[name=content]');
            content = $input.val();
            new_task = that.find_food(data, content);
            if (that.add_task(new_task)) {
                //使输入框变为默认文字

                $input.val(null);
            }
        });
    },
    //查找并返回输入的food
    find_food: function (data, content) {
        if (!content) return;
        var task = {
            content: content,
            id: data[content].id,
            heat: data[content].heat,
            imgUrl: data[content].imgUrl,
            score: data[content].score,
            count: data[content].count
        };
        return task;

    },
    //添加new_task
    add_task: function (new_task) {
        this.task_list.push(new_task);

        this.refresh_task_list();
        return true;
    },
    //刷新task列表
    refresh_task_list: function () {
        store.set('task_list', this.task_list);
        console.log(store.get('task_list'));
        this.render_task_list();
    },
    //渲染task列表
    render_task_list: function () {
        var $task_list = $('.task-list');
        $task_list.html('');
        var completed_item=[];
        for (var i = 0; i <this.task_list.length; i++) {
            var item = this.task_list[i];

            if (item && item.complete) {
                completed_item[i] = item;
            }
            else {
                var $task = this.render_task_item(item, i);

            }
            $task_list.append($task);
        }
        for (var j = 0; j <completed_item.length; j++) {
            $task = this.render_task_item(completed_item[j], j);
            if (!$task) continue;
            $task.addClass('completed');
            $task_list.prepend($task);


                
        }

        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        this.listen_task_delete();
        this.listen_checkbox_select();
        this.listen_task_detail();


    },
    listen_task_detail:function(){
        var index;
        var that=this;
        $task_detail=$('.task-detail');
        $task_detail_mask=$('.task-detail-mask');
        $task_detail_mask.on('click',this.hide_task_detail);
        $('.task-item').on('dbclick',function(){
            index=$(this).data('index');
            this.show_task_detail(index);
        });

        $task_detail_trigger.on('click',function(){
            var $this=$(this);
            var $item=$this.parent().parent();
            index=$item.data('index');
            that.show_task_detail(index);
        });
    },
    show_task_detail:function(index){
        this.render_task_detail(index);
        current_index=index;

        $task_detail.show();
        $task_detail_mask.show();
    },
    render_task_detail:function(index){
        if(index===undefined||this.task_list[index]===undefined){
            return;
        }
        var item=this.task_list[index];
        var tpl=
            '<form>'+
            //     '<div class="content">'+
            //         item.content+
            //     '</div>'+
            //     '<div class="input-item">'+
            //         '<img class="food-img" src="' + (item.imgUrl) + '"/>' +
            //             '<div class="food-comment">'  +
            //                     '<span class="food-heat">'+ "heat：" + item.heat + "cal"+'</span>'+
            //                     '<span class="food-count">'+ 'count:'+
            //                         '<input type="text"/>'+
            //                     '</span>'+
            //                 '<div class="star-container">' +
            //                     '<div class="stars" id="'+item.content+'">' +
            //                     '</div>' +
            //                 '</div>' +
            //             '</div>' +
            //     '</div>'+
            // '<div class="input-item"><button type="submit">update</button></div>' +






            

            '<div class="content">'+
                     item.content+
            '</div>'+
            '<div class="input-item">'+
                     '<img class="food-img" src="' + (item.imgUrl) + '"/>' +

'<table id="detail" border="0">' +
'<tr class="alt">'+
  '<td>'+ "Heat" +'</td>' +
  '<td class="right">'+ "200"  +'</td>' +
'</tr>'+
'<tr >'+
  '<td>'+ "Carbon and Water"+'</td>'+
  '<td class="right">'+ "500" +'</td>'  +
'</tr>'  +
'<tr class="alt">'+
  '<td>'+ "Protein"+'</td>'+
  '<td class="right">'+ "200" +'</td>'  +
'</tr>'+
'<tr >'+
  '<td>'+ "Fat"+'</td>'+
  '<td class="right">'+ "200" +'</td>'  +
'</tr>'+

          '</div>'+
          
          '</form>';



        var starsArr = [];
        var $temp={};
        var starsById='#'+item.content;
        var $food_star = $(tpl).find(starsById.toString());
        starsArr = this.convertToStarsArray(item.score);
        for (var i = 0; i < starsArr.length; i++) {
            if (starsArr[i] == 1) {
                $food_star.append('<img src="img/star.png">');
            } else if (starsArr[i] == 0.5) {
                $food_star.append('<img src="img/halfstar.png">');
            } else {
                $food_star.append('<img src="img/none-star.png">');
            }

        }
        $temp = $(tpl);
        $temp.find('.stars').replaceWith($food_star);
        $task_detail.html('').append($temp);
    },

    hide_task_detail:function(){
        $task_detail.hide();
        $task_detail_mask.hide();
    },
    listen_checkbox_select:function() {
        var that=this;
        this.$checkbox_checked = $('.task-list .complete[type=checkbox]');
        this.$checkbox_checked.on('click',function(){
            var $this=$(this);
            var index=$this.parent().parent().parent().data('index');
            var item=store.get('task_list')[index];
            if(item.complete){

               that.update_task(index,{complete:false});

            }else{

               that.update_task(index,{complete:true});
            }

        })
    },
    update_task:function (index,data) {
        if (!index || !this.task_list[index])
            return;
      this.task_list[index]=$.extend(this.task_list[index],data);
      this.refresh_task_list();
    },
    //渲染单个task
    render_task_item: function (data, index) {

        if (data===undefined || index===undefined){
            return;
        }
        var list_item_tpl=
            '<div class="task-item" data-index="' + index + '" >' +
            '<div class="food">' +
            ' <span><input class="complete" ' + (data.complete ? 'checked ' : '') + 'type="checkbox"></span>' +
            '<img class="food-img" src="' + (data.imgUrl) + '"/>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<div class="food-comment">' + "heat：" + data.heat + "cal（100）" +
            '<div class="star-container">' +
            '<div class="stars" id="'+data.content+'">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="fr">' +
            '<span class="action delete">delete</span>' +
            '<span class="action detail"> detail</span>' +
            '</div>' +
            '</div>';
        var starsArr = [];
        var $temp={};
        var starsById='#'+data.content;
        var $food_star = $(list_item_tpl).find(starsById.toString());
        starsArr = this.convertToStarsArray(data.score);
        for (var i = 0; i < starsArr.length; i++) {
                if (starsArr[i] == 1) {
                    $food_star.append('<img src="img/star.png">');
                } else if (starsArr[i] == 0.5) {
                    $food_star.append('<img src="img/halfstar.png">');
                } else {
                    $food_star.append('<img src="img/none-star.png">');
                }

        }


            $temp = $(list_item_tpl);
            $temp.find('.stars').replaceWith($food_star);

        return $temp;
    },
    //将评分转化成星星
    convertToStarsArray: function (stars) {
        var arr=[];
        for (var i = 10; i <= 50; i = i + 10) {
            if (i <= stars) {
                arr.push(1);
            }
            else if (i - 5 ==stars) {
                arr.push(0.5);
            }
            else {
                arr.push(0);
            }
        }
        return arr;
    },
    listen_task_delete:function() {
        var that=this;
        $task_delete_trigger.on('click',function(){
            var $this=$(this);
            var $item=$this.parent().parent();
            var index=$item.data('index');
            that.pop('Do you want delete the item?').then(function(dfd){
                dfd?food.delete_task(index):null;
            });
        })
    },
    delete_task:function(index){
            if(index===undefined||!this.task_list[index]) return;
            delete this.task_list[index];
            this.refresh_task_list();
    },

    pop:function(arg){
        var conf={},
            $body=$('body'),
            $window=$(window),
            $box,
            $mask,
            $title,
            $content,
            $confirm,
            dfd,
            timer,
            confirmed,
            $cancel;
        dfd=$.Deferred();
        if(typeof arg=='string')conf.title=arg;
        else conf=$.extend(conf,arg);
        $box=$('<div class="box">' +
            '<div class="pop-title">'+conf.title+'</div>'+
            '<div class="pop-content">'+
            '<div>' +
            '<button style="margin-right: 5px;" class="primary confirm">confirm</button> ' +
            '<button class="cancel">cancel</button></div>'+'</div>'+
            '</div>');
        $title=$box.find('.pop-title');
        $content=$box.find('.pop-content');
        $confirm=$content.find('button.confirm');
        $cancel=$content.find('button.cancel');
        $mask=$('<div class="mask"></div>');
        timer=setInterval(function(){
            if(confirmed!==undefined){
                dfd.resolve(confirmed);
                clearInterval(timer);
                dismiss_pop();
            }
        },50);
        $confirm.on('click',function(){
            confirmed=true;
        });
        $cancel.on('click',cancel);
        $mask.on('click',cancel);
        function cancel(){
            confirmed=false;
        }
        function dismiss_pop(){
            $mask.remove();
            $box.remove();
        }

        function adjust_box_position(){
            var window_width=$window.width(),
                window_height=$window.height(),
                box_width=$box.width(),
                box_height=$box.height(),
                move_x,
                move_y;
            move_x=(window_width-box_width)/2;
            move_y=(window_height=box_height)/2;
            $box.css({
                left:move_x,
                top:move_y
            })
        }
        $window.on('resize',function(){
            adjust_box_position();
        });
        $mask.appendTo($body);
        $box.appendTo($body);
        $window.resize();
        return dfd.promise();
    }
};

//////////////////////  How to Call BackEnd REST Service START ////////////////
var param = {};
param.foodNm="p";
$("#foodsubmit").click(function(){
	$.ajax({
	    url : conf.foodielover_backend_url + "/rest/findFood",  
	    //async: false,  
	    type : "POST",  
	    dataType: "json",  
	    contentType: "application/json",  
	    data: JSON.stringify(param),
//	    }).success(function(resp){
	    success: function (resp) {
	    	console.log("ffffff");
	    },
	    error: function (){
//	    }).error(function(){
	    	console.log("======error todo ======");
//		});
	    }
	});
});
//////////////////////How to Call BackEnd REST Service End ////////////////

