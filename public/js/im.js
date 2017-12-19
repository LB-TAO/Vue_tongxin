var chatVM = new Vue({
    el:"#app",
    data:{
        user:"default",
        to:"",
        recommends:['coco','alex','kallen'],
        selectedIndex:null,
        isLogin:false,
        socket:null,
        msg:"",
        chats:[],
    },
    // 构建vue实列之后，再连接服务器
    // created是一个生命周期的钩子函数，就是一个vue实例被生成后调用这个函数;
    // 一般可以在created函数中调用ajax获取页面的初始化所需的数据;
    created:function(){
       // 链接IM服务器
       this.socket = io.connect("localhost:3000");  
    },
    methods:{
        // 选择用户的方法，传入参数idx
        selectUser:function(idx){ 
            this.selectedIndex = idx;
            this.to = this.recommends[idx];
        },
        login:function(){
            // 使用v-if切换页面
            this.isLogin = true;
            // user的长度大于零，说明有用户名输入
            if(this.user.length > 0){
                // 向服务器发送消息
                this.socket.send(this.user);
            }
            
            var self = this;
            this.socket.on('to_'+this.user,function(data){
                self.chats.push(data);
            });
        },
        sendMsg:function(){
            // 构造数据包
            var data = {
                from:this.user,
                to:this.to,
                msg:this.msg
            };
            this.chats.push(data);
            // 通过自定义事件发送chats事件，并携带数据data，data中有用户名form，好友to，消息msg
            // chats中包含了登录事件的data，还有发送消息事件的data
            this.socket.emit('chats',data);

            this.msg = "";
        }
    }
});
