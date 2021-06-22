(function (Vue) {
	//声明一个key值
	const STORAGE_KEY = 'item';
	//声明变量获取保存本地数据
	const localstorage ={
		//获取数据方法
		fetch:function(){
			//JSON.parse将字符串转换为数组对象
			return JSON.parse(
				localStorage.getItem(STORAGE_KEY)||'[]'
			)
		},
		//保存数据方法
		save:function(items){
			//JSON.stringify(value)将value中的内容转成字符串
			localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
	}
	const items = [
		
		{
			id:1,     				//编号
			content:'今天早上学JS',	 //事件内容
			completed:false			//完成状态
		},
		{
			id:2,     				//编号
			content:'今天下午学HTML',//事件内容
			completed:false			//完成状态
		},
		{
			id:3,     				//编号
			content:'今天晚上学CSS', //事件内容
			completed:false			//完成状态
		}
		
	]
	//自定义全局指令，自动获取焦点
	Vue.directive('focus',{
		inserted(el,binding){
			el.focus();
		},
		update(el,binding) {
			if(binding.value)
			el.focus();
		},
	})
 
	var vm = new Vue({
		el:'#todoapp',
		data:{
			title:'todos',
			//items:items,       // ES6中可直接写一个items等价于——>items:items
			items:localstorage.fetch(),
			currentItem:null,
			filterStatus:'all'
		},
		//自定义局部指令，自动获取焦点
		//directives:{
		//	'focus':{
		//		update(el,binding) {
		//			if(binding.value)
		//			el.focus();
		//		},
		//	}
		//},
		computed: {
			//在Vue的计算属性中创建filter方法函数用于过滤出目标数据, 用于感知filterStatus的状态值变化：
			filter(){
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter(function(i){
							return	!i.completed;
						})
						break;
					case 'completed':
						return this.items.filter(i=>i.completed);
						break;
					//否则默认返回所有事件项
					default:
						return this.items;
						break;
				}
			},
			toggleAll:{
				//当事件列表中的状态发生变化，更新复选框状态
				get(){
					//恒等式左边代表未完成的个数，右边恒为0，只有两边恒等，则返回true
					//否则返回false
					return this.remain === 0;
				},
				//当复选框状态发生变化，更新任务列表所有事件项的状态
				set(newStatus){
					//遍历出数组中所有事件项
					//将当前复选框的状态赋值给每个事件项的completed状态
					this.items.forEach(function(i){
						i.completed = newStatus;
					})
				}
			},
			remain(){    //ES6简写
				const unitems = this.items.filter(function(i){
					return i.completed === false;
				});
				return unitems.length;
			}
		},
		methods: {
			//完成编辑，保存数据
			enter(item,index,e){
				//1获取当前输入框的值
				const content = e.target.value.trim();
				//2判断输入框的值是否为空，如果为空，删除事件项
				if(!content){
					//复用下面的removeItem()函数
					this.removeItem(index);
					return;
				}
				//3否则，更新事件项
				else{
					item.content = content;
				}
				//4取消editing的作用，退出编辑状态
				this.currentItem = null;
			},
			//取消编辑状态
			esc(){
				//当this.currentItem为空时，editing:item === currentItem返回false
				//则取消editing的作用
				this.currentItem = null;
			},
			//进入双击编辑状态
			dblc(item){
				//把当前点击的事件项赋值给currentItem数组
				this.currentItem = item;
			},
			clearItems(){
				//过滤所有未完成的事件项并赋值给新数组i
				this.items = this.items.filter(function(i){
				    return i.completed === false;
				})
				//ES6写法：
				//this.items = this.items(i => !i.completed );
			},
			removeItem(index){
				//splice(index,1)从要删除的位置，每次删除一个
				this.items.splice(index,1);
			},
			addItem:function(e){   //ES6中 直接——> addItem(){}
				const content = e.target.value.trim();
				if (!content.length){
					return;
				}
				else{
					const id = this.items.length + 1;
					this.items.push(
						{
							id:id,     				//ES6直接一个 id 即可
							content:content,        //ES6直接一个 content 即可
							completed:false			//完成状态默认false
						}
					)
				}
				e.target.value = "";
			}
		},
		watch: {
			items:{
				deep:true,
				handler:function(newItems,oldItems){
					//将数据保存到本地
					localstorage.save(newItems)
				}
			}
		},
	})
	//window.onhashchange要在Vue实例对象之外
	window.onhashchange = function(){
		//截取从索引为2之后的hash字符串，若为空，则返回'all'
		const hash = window.location.hash.substr(2)||'all';
		//将hash赋值给上面Vue实例中的filterStatus
		//在Vue的计算属性中创建filter方法函数
		vm.filterStatus = hash;
	}
	//调用
	window.onhashchange();
 
})(Vue);