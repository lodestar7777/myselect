/**
 * Created by Administrator on 2016/3/4.
 */
/*
 * 选择框类
 * divselector：id选择器（选择框容器div的id, 以#号开头）
 * config：配置
 *        参数：
 *             onCheckCallback ：指定ztree对象onCheckCallback的回调函数
 *             searchtextflag  ：是否显示搜索框
 *
 *             width: 控件宽度
 *             minHeight: 树容器最小高度
 *             maxHeight: 树容器最大高度
 *
 * */
$.mydivselect = function(divselector, config) {
    if( 'undefined' === typeof config ){
        //默认
        var searchtext_flag = true;
        var showAddDelButton = false;

        //允许访问祖先节点
        var allowReadParentNodeValue = 'true';
    }else{
        //设置搜索框是否显示
        if( 'undefined' === typeof config.searchtextflag ){
            var searchtext_flag = true;
        }else{
            var searchtext_flag = config.searchtextflag;
        }

        if( searchtext_flag ){
            //显示搜索框，设置搜索方式，ajaxSearch = true(ajax 方式) ajaxSearch = false(本地搜索方式)
            //config.ajaxSearch.state true：ajax方式搜索   false:在ztree上搜索
            //ajaxSearch.param.searchKey 关键字
            //ajaxSearch.param.url ajax search请求url
            if( 'undefined' === typeof config.ajaxSearch || 'undefined' === typeof config.ajaxSearch.state ){
                var ajaxSearch = false;
            }else{
                var ajaxSearch = config.ajaxSearch.state;
                var ajaxSearchParam = config.ajaxSearch.param;
                var onAjaxCallback = config.ajaxSearch.onAjaxCallback;
                if( config.ajaxSearch.onAjaxSearchCallback ){
                    var onAjaxSearchCallback = config.ajaxSearch.onAjaxSearchCallback;
                }else{
                    var onAjaxSearchCallback = '';
                }
            }
        }

        //设置树形显示区始终显示(始终显示树型区域)
        if( 'undefined' === typeof config.showTreeZoneForevery ){
            var showDropContentForevery = false;
        }else{
            var showDropContentForevery = config.showTreeZoneForevery;
        }

        //设置添加删除选择器按钮是否显示
        if( 'undefined' === typeof config.showAddDelButton ){
            var showAddDelButton = false;
        }else{
            var showAddDelButton = config.showAddDelButton;
            if( showAddDelButton ){
                //添加删除按钮数量
                if( 'undefined' === typeof config.setAddDelButton || 'undefined' === typeof config.setAddDelButton.addTip ){
                    var addTip = '最多添加5个宏观指标';
                }else{
                    var addTip = config.setAddDelButton.addTip;
                }

                if( 'undefined' === typeof config.setAddDelButton || 'undefined' === typeof config.setAddDelButton.delTip ){
                    var delTip = '至少需要2个宏观指标';
                }else{
                    var delTip = config.setAddDelButton.delTip;
                }

                if( 'undefined' === typeof config.setAddDelButtonNum || 'undefined' === typeof config.setAddDelButtonNum.max){
                    var addMax = 5;
                }else{
                    var addMax = config.setAddDelButtonNum.max;
                }

                if( 'undefined' === typeof config.setAddDelButtonNum || 'undefined' === typeof config.setAddDelButtonNum.min){
                    var delMin = 2;
                }else{
                    var delMin = config.setAddDelButtonNum.min;
                }
            }
        }


        //是否允许取得祖先节点值
        if( 'undefined' === typeof config.allowReadParentNodeValue ){
            var allowReadParentNodeValue = 'true';
        }else{
            var allowReadParentNodeValue = config.allowReadParentNodeValue;
        }

        //check zTree时执行的回调函数
        if( 'undefined' === typeof config.onCheckCallback ){
            var onCheckCallback = 'undefined';
        }else{
            var onCheckCallback = config.onCheckCallback;
        }

        //check zTree时执行的回调函数
        if( 'undefined' === typeof config.onCheckCallbackForTip ){
            var onCheckCallbackForTip = 'undefined';
        }else{
            var onCheckCallbackForTip = config.onCheckCallbackForTip;
        }
    }

    this._dom = divselector;
    var data = {};
    var divselector = $.trim( divselector );
    var pos = divselector.indexOf('#');
    var divselectid = (pos === 0) ? divselector.substring(1) : false;

    //取得前缀
    var divPrefix = divselectid.replace(/([^\d]+)(.*)/, "$1");

    this._divPrefix = divPrefix;

    //非#号开头
    if( divselectid === false ){
        return false;
    }

    var placeholder = '请选择';
    var placeholder_search = '请输入搜索关键字';

    //ztree callback
    this.beforeClick = function(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj( treeId );
        zTree.checkNode(treeNode, !treeNode.checked, null, true);
//            return false;
    }

    var _groupObj = {};
    this._groupObj = {};

    //设置添加删除按钮才有的分组设置操作方法
    if( showAddDelButton ){
        this.setGroupObj = function( arrGroupObj ){
            _groupObj = arrGroupObj;
            this._groupObj = arrGroupObj;
        }

        this.getGroupObj = _getGroupObj = function(){
            return _groupObj;
        }
    }


    //ztree callback: handle check event
    this.onCheck = function (e, treeId, treeNode) {
        //console.log(e);
        //console.log(treeId);
        //console.log(treeNode);
        var treeDomId = "#" + treeId.split("_")[0];
        //存在下拉选项框分组
        if(showAddDelButton){
            var arrGroupObj = self._getGroupObj();
        }
        var zTree = $.fn.zTree.getZTreeObj( treeId ),
            nodes = zTree.getCheckedNodes( true ),
            arrIds = [],
            arrV = [];
        //console.log(nodes);
        if( nodes.length > 5){
        	//取消最后一个check
        	zTree.checkNode(nodes[nodes.length-1], false, false);
        	alert("不大于5");
        	return false;
        }
        for (var i=0, l=nodes.length; i<l; i++) {
            //不允许取得父级节点
            if( !allowReadParentNodeValue && nodes[i].isParent )
                continue;

            arrIds.push( nodes[i].id );
            arrV.push( nodes[i].text );
        }
        var ids = arrIds.join();

        if( showAddDelButton ){
            for(var i = 0,len = arrGroupObj.length; i < len; i++ ){
                //重复选择
                if( ids != "" && arrGroupObj[i].getSelectValue() == ids && arrGroupObj[i]._dom != treeDomId){
                    alert( '此项已选择,请重新选择');
                    return false;
                }
            }
        }
        var v = arrV.join();
        if (arrV.length == 0 )
            v = placeholder;

        $("#"+id_select_text).val( v );
        $("#"+id_select_values).val( ids );
        if( "function" === typeof onCheckCallback ){
            onCheckCallback(e, treeId, treeNode);
        }

    }

    //取得ztree dom id
    this.getZtreeId = function(){
        return id_dropcontent;
    }

    //选择指定节点。根据节点id值查找节点并选中节点
    //strNodeIdName:节点id属性名称  arrNodeId：属性值
    this.checkById = function(strNodeIdName, arrNodeId, param){
        if( typeof arrNodeId == "undefined" ){
            //console.log(arrNodeId);
            return false;
        }
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        var nodeNum = arrNodeId.length;
        var ztreeNode = [];
        //根据id找ztree节点对象
        for(var i=0; i < nodeNum; i++ ){
            ztreeNode[i] = zTreeObj.getNodeByParam(strNodeIdName, arrNodeId[i], param);
        }

        //设置节点对象check
        for(var i=0; i < nodeNum; i++ ){
            //参数：check的节点，true:选中, false:不关联, true:执行回调函数
            zTreeObj.checkNode(ztreeNode[i], true, false, true );
        }

    }

    this.checkByNum = function( num ){
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        var i =0;
        var ztreeNode = [];
        for(var value in data ){
            if( i < num ){
                ztreeNode[i] = zTreeObj.getNodeByParam('id', data[value]['id'] );
                i ++;
            }else{
                break;
            }
        }
        //设置节点对象check
        for(var i=0; i < num; i++ ){
            //参数：check的节点，true:选中, false:不关联, true:执行回调函数
            zTreeObj.checkNode(ztreeNode[i], true, false, true );
        }
    }


    //选择所有ztree的选项
    this.checkAll = function(){
        //check all
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        zTreeObj.checkAllNodes(true);

        var nodes = zTreeObj.getCheckedNodes( true ), ids = "", v = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            ids += nodes[i].id + ",";
            v += nodes[i].text + ",";
        }
        if (ids.length > 0 ) ids = ids.substring(0, ids.length-1);
        if (v.length > 0 )
            v = v.substring(0, v.length-1);
        else
            v = placeholder;

        $("#"+id_select_text).val( v );
        $("#"+id_select_values).val( ids );

    }

    //取消所有选择
    this.uncheckAll = function(){
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        zTreeObj.checkAllNodes(false);
    }

    //清除ztree选择
    this.clear = function(){
        $("#"+id_select_text).val( "" );
        $("#"+id_select_values).val( "" );
    }

    //清除ztree
    this.clearTree = function( zTreeData ){
        //清除ztree
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        $.fn.zTree.init( $("#"+id_dropcontent), zTreeObj.setting, zTreeData );

        //清除ztree选择
        $("#"+id_select_text).val( "" );
        $("#"+id_select_values).val( "" );
    }

    //初始化ztree
    this.zTreeInit = function( setting, zTreeData ){
        data = zTreeData;
        $.fn.zTree.init( $("#"+id_dropcontent), setting, zTreeData );
    }

    //销毁ztree对象
    this.destroy = function(){
        $("#"+id_select_text).val( "" );
        $("#"+id_select_values).val( "" );
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        if( zTreeObj ){
            zTreeObj.destroy();
        }
    }



    //取得选择的项目值
    this.getSelectValue = function(){
        return $("#"+id_select_values).val();
    }

    //取得选择的项目值
    this.getSelectText = function(){
        return $("#"+id_select_text).val();
    }


    //取得treeNode父路径
    this.getParentPath = function(id, separator){
        if( typeof separator == "undefined"){
            separator = " > ";
        }
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
        var treeNode = zTreeObj.getNodeByParam("id", id, null);
        var path = [];
        var parentNode =  treeNode.getParentNode();
        while( parentNode != null ){
            path.push(treeNode.text);

            parentNode = treeNode.getParentNode();
            treeNode = parentNode;
        }
        return path.reverse().join(separator);
    }

    //显示弹出层(相对定位)[用于固定显示]
    function showMenu( paging ){
        //有分页并且分页大于2
        if( paging ){
            if( paging.totalPage && paging.totalPage > 1 ){
                //显示分页
                showPaging( "#"+id_dropcontent, paging, treePageClick );
            }else{
                hidePaging( "#"+id_dropcontent );
            }
        }

        var display = $("#" + id_dropcontent).css("display");
        if( display == 'none' ){
            var selecterObj = $("#"+divselectid);
            var selecterObjOffset = $("#"+divselectid).offset();
            $("#"+id_treecontainer).css(
                {
                    left: selecterObj.left+"px",
                    top:  selecterObjOffset.top + selecterObj.outerHeight()+"px",
                    'background-color': "#ebebeb",
                    overflow: "auto",
//                            position: "absolute",
                    width:"auto"
                }
            ).slideDown("fast");

            $("#" + id_dropcontent).slideDown('fast');
            //$("body").bind("mouseup", onBodyDown);
        }
    }

    //弹出层（绝对定位）[用于下拉弹出显示]
    function showMenu2( paging ){
        //有分页并且分页大于2
        if( paging ){
            if( paging.totalPage && paging.totalPage > 1 ){
                //显示分页
                showPaging( "#"+id_dropcontent, paging, treePageClick );
            }else{
                hidePaging( "#"+id_dropcontent );
            }
        }

        var display = $("#" + id_dropcontent).css("display");
        if( display == 'none' ){
            var selecterObj = $("#"+divselectid);
            var selecterObjOffset = $("#"+divselectid).offset();
//console.log(selecterObj.outerWidth());
//console.log(selecterObj);
//console.log(selecterObj.width());
            $("#"+id_treecontainer).css(
                {
                    left: selecterObjOffset.left+"px",
                    top:  selecterObjOffset.top + selecterObj.outerHeight()+"px",
                    'background-color': "#ebebeb",
                    overflow: "auto",
                    width:"auto",
                    minWidth:"150px",
                    zIndex:"1000",
                    position:"absolute"
                }
            ).slideDown("fast");

            if( $("#"+id_treecontainer).height() > 300 ){
                $("#"+id_treecontainer).css("height", "auto")
            }

            $("#" + id_dropcontent).slideDown('fast');

            //////////////绑定隐藏处理事件//////////////////
            $("body").bind("mouseup", onBodyDown);
            /////////////////////////////////////

            //绑定浏览器大小改变实践
            /*$(window).resize(
             function(){
             //                    alert("resize");
             $("#"+id_treecontainer).css(
             {
             left: selecterObjOffset.left+"px",
             top:  selecterObjOffset.top + selecterObj.outerHeight()+"px",
             'background-color': "#ebebeb",
             overflow: "auto",
             //                            position: "absolute",
             width:"auto",
             zIndex:"1000",
             position:"absolute"
             //                        position:"relative"
             }
             )
             }
             )*/
        }
    }

    //隐藏弹出层
    function hideMenu() {
        //弹出层隐藏中
        menuHiding = true;
        $("#" + id_dropcontent).fadeOut("fast");
        hidePaging("#" + id_dropcontent);
        $("body").unbind("mouseup", onBodyDown);
        menuHiding = false;
    }

//i=0;
    //显示搜索框
    function showSearchText(){
        var display = $("#" + id_search).css("display");
        if( display == 'none' ){
            var searchTextDom = $("#" + id_search);

            //判断是否正在使用输入法输入
            cpLock = false;
            searchTextDom.bind('compositionstart',function(){
                cpLock = true;
            })

            searchTextDom.bind('compositionend',function(){
                cpLock = false;
            })

            //旧的输入内容
            old_cate_fuzzy_value = '';

            //输入开始时间
            var d=new Date();
            var input_start = d.getTime();

            //绑定搜索内容
            $("#" + id_search).unbind("input mouseup").bind(
                "keyup mouseup",
                function( e ){
                    //非输入法输入
                    if(!cpLock){

                        //搜索关键字
                        var cate_fuzzy_value = $.trim($("#" + id_search ).val());

                        //文本框内容没有变化（正在输入法状态输入）
                        if( old_cate_fuzzy_value == cate_fuzzy_value){
                            return false;
                        }else{
                            //输入法输入完成后空格输入内容置入文本框，文本框内容变化，或者直接输入时内容变化
                            old_cate_fuzzy_value = cate_fuzzy_value;

                            //输入结束时间
                            var d=new Date();
                            var input_end = d.getTime();
                            //输入开始到结束时间差
                            var inputTime = input_end - input_start;

                            //小于0.5秒时，不查询
                            if( inputTime/1000 < 0.5){
                                input_start = input_end;
                                return;
                            }
                        }

                        //ajax查询
                        if( ajaxSearch ){
                            var data = {};
                            //搜索关键字post key name
                            var searchKey = ajaxSearchParam.searchKey;
                            data[searchKey] = cate_fuzzy_value;

                            if( "function" === typeof onAjaxSearchCallback ){
                                data = onAjaxSearchCallback( data );
                            }

                            $.ajax({
                                type: 'POST',
                                url: ajaxSearchParam.url,
                                data: data,
                                success:
                                    function(data){
                                        //返回结果加载到树
                                        //onAjaxCallback( data );
                                        //显示搜索提示
                                        showSearchTip( data.data, data.page );

                                    },
                                dataType: 'json'
                            })
                        }else{
                            //直接在树对象中查询
                            //树对象
                            var treeObj = $.fn.zTree.getZTreeObj( id_dropcontent );
                            //树节点模糊搜索
                            var nodes = treeObj.getNodesByParamFuzzy("text", cate_fuzzy_value);

                            //查询到关键字对应节点显示搜索提示
                            if( cate_fuzzy_value == "" ){
                                showSearchTip( [] );
                                //全部收起
                                treeObj.expandAll(false);
                                //取消选中
                                treeObj.cancelSelectedNode();
                                var paging = _self.getPaging();
                                showMenu2( paging );

                                //停止冒泡
                                return false;
                            }else{
                                if( isShowMenu() ){
                                    //不是固定显示树型下拉框
                                    if( !showDropContentForevery ){
                                        //隐藏
                                        hideMenu();
                                    }
                                }
                                //显示搜索提示
                                showSearchTip( nodes );
                            }

                            //全部收起
                            treeObj.expandAll(false);

                            //高亮搜索到的节点
                            if ( nodes.length>0 ) {
                                //取消选中的节点
                                treeObj.cancelSelectedNode();
                                for( var i=0; i < nodes.length; i++){
                                    //展开搜索到的节点结果
                                    //找父节点
                                    var parentnode = nodes[i].getParentNode();
                                    //将父节点展开
                                    treeObj.expandNode(parentnode, true, false, true);
                                    //设置选中节点
                                    treeObj.selectNode(nodes[i], true);
                                }
                            }

                        }


                        $("#" + id_search).focus();
                        return false;

                    }



                }
            );
            $("#" + id_search).focus();

            //$("#" + id_search ).show().css("display","block");
            $("#" + id_search ).show();
        }
    }

    //隐藏搜索框
    function hideSearchText(){
        $("#" + id_search).hide();
        $("#" + id_search).unbind("keyup mouseup");
        //return false;
    }

    //显示搜索提示
    /*
    * treeNodes:树节点
    * paging: 分页信息
    * */
    function showSearchTip( treeNodes, paging ){
        //treeNodes根据关键字搜索到的树节点
        var zTreeObj = $.fn.zTree.getZTreeObj( id_dropcontent );

        //取得单选或多选样式
        var input_type = zTreeObj.setting.check.chkStyle;

        //取得的结果节点数量
        var len = treeNodes.length;
        var html = "";
        if( len > 0 ){
            for( var i = 0; i < len; i ++ ){
                if( treeNodes[i].checked ){
                    var str_checked = "checked='checked'";
                }else{

                    var str_checked = "";
                }
                html += ("<input class=' " + class_search_tip + "' type='" + input_type + "' value='" + treeNodes[i].id + "'" + str_checked + " name='" + class_search_tip +  "' text='" + treeNodes[i].text +"' />" + treeNodes[i].text + "<br/>");
            }
            //html += '     <li style="background:#cccccc"><span id="'  + id_search_tip_close +  '">关闭提示</span></li>';
            //console.log(html);
            $("#" + id_search_tip_content).empty().append( html );

            //绑定关闭搜索提示
            bind_tip_close_click();

            //绑定选择处理事件：选中则相应ztree选中，取消同时ztree对应节点也取消选中
            $("." + class_search_tip).unbind("click").bind("click", function(){

                    var nodeId = $(this).val();

                    ztreeNode = zTreeObj.getNodeByParam("id", nodeId);
                    //ztreeNode非空时，是树节点，选择ztree联动
                    if( ztreeNode ){
                        //是否选中
                        var checked = $(this).is(':checked');
                        if( checked ){
                            //参数：check的节点，true:选中, false:不关联, true:执行回调函数
                            zTreeObj.checkNode(ztreeNode, true, false, true );
                        }else{
                            //参数：check的节点，true:选中, false:不关联, true:执行回调函数
                            zTreeObj.checkNode(ztreeNode, false, false, true );
                        }
                    }else{
                        var text = $(this).attr('text');
                        var arrIds = [],
                            arrV = [];

                        arrIds.push( nodeId );
                        arrV.push( text );

                        //id连接,逗号分割
                        var ids = arrIds.join();

                        //文本连接
                        var v = arrV.join();
                        if (arrV.length == 0 )
                            v = placeholder;

                        $("#"+id_select_text).val( v );
                        $("#"+id_select_values).val( ids );

                        //回调函数调用
                        if( "function" === typeof onCheckCallback ){
                            onCheckCallbackForTip(ids, v);
                        }
                    }
                }
            );

            //setTimeout(alert($("#"+id_search_tip_container).height()), 1000);
            //有分页并且分页大于2
            if( typeof paging !== 'undefined' &&  paging.totalPage && paging.totalPage > 1 ){
                //显示分页
                showPaging( "#"+id_search_tip_content, paging, tipPageClick );
            }else{
                hidePaging( "#"+id_search_tip_content );
            }

            //显示搜索提示
            //$("#" + id_search_tip_container).show();
            var display = $("#" + id_search_tip_container).css("display");
            if( display == 'none' ){
                var selecterObj = $("#"+divselectid);
                var selecterObjOffset = $("#"+divselectid).offset();

                $("#"+id_search_tip_container).css(
                    {
                        left: selecterObjOffset.left+"px",
                        top:  selecterObjOffset.top + selecterObj.outerHeight()+"px",
                        'background-color': "#ebebeb",
                        overflow: "auto",
//                            position: "absolute",
                        width:  "auto",
                        minWidth:"150px",
                        zIndex:"1001",
                        position:"absolute",
                        height:"auto"
                    }
                ).slideDown("fast");


                //绑定点击body事件
                $("body").unbind("mouseup").bind("mouseup", onBodyDown);



                if( $("#"+id_search_tip_container).height() > 300 ){
                    //容器高度超过300px,设置固定高度并显示滚动条
                    $("#"+id_search_tip_container).css("height", "100px"
                        //{
                        //    height: "100px"
                        //}
                    ).slideDown("fast")
                }

                //sleep();
                //alert($("#"+id_search_tip_container).height());

                $("#" + id_search_tip_content).slideDown('fast');
                bind_tip_hover();
            }
        }else{
            //无匹配数据隐藏
            $("#" + id_search_tip_container).hide();
        }

        return false;


    }

    //隐藏搜索框
    function hideSearchTip(){
        $("body").unbind("mouseup", onBodyDown);
        $("#" + id_search_tip_container).hide();
        //return false;
    }

    /*
    * 显示分页
    *
    * callback: tip分页:clickPage  tree分页：treePageClick
    * */
    function showPaging( dom, page, callback ){

        var html = '<div class="page">';
        html += '<ul class="pages">';

        if(page.currPage > 1){
            var prevPage = page.currPage - 1;
            html += '<a class="btn btn-default pagebtn" page="' + prevPage + '" " role="button">上一页</a>';
        }
        //大于1页时显示分页
        if( page.totalPage > 1 ){
            if( page.totalPage <= 5 ){
                for(var i=1; i<=page.totalPage; i++){
                    if( i == page.currPage ){
                        html += '<a class="btn btn-default pagebtn active" page="' + i + '" >' + i + '</a>'
                    }else{
                        html += '<a class="btn btn-default pagebtn" role="button" page="' + i + '" ">' + i + '</a>'

                    }
                }
            }else{
                for(var i=1; i<=page.totalPage; ){
                    if( i == page.currPage ){
                        html += '<a class="btn btn-default pagebtn active" page="' + i + '" >' + i + '</a>'
                    }else{
                        html += '<a class="btn btn-default pagebtn" role="button" page="' + i + '" >' + i + '</a>'

                    }

                    if( i<2){
                        i++;
                    }else if( i < (page.currPage-1) ){
                        html += '<span>...</span>';
                        i = (page.currPage - 1);
                    }else if( i < (page.currPage + 1) ){

                        i ++;
                    }else if( i < (page.totalPage - 1)){
                        html += '<span>...</span>';
                        i = (page.totalPage - 1);
                    }else{
                        i ++;
                    }
                }

            }

            if(page.currPage < page.totalPage ){
                var nextPage = page.currPage + 1;
                html += '<a class="btn btn-default pagebtn" page="' + nextPage + '"  role="button">下一页</a>';
            }

        }

        html += '</ul>';
        html += '</div>';

        $(dom).next('.page').remove();
        $(dom).after( html );
        //var  xxx = $(dom).next('.page').find('a');
        //console.log( xxx );
        $(dom).next('.page').find('a').on("click", function(){
            var page = $(this).attr("page");
            //分页点击事件处理
            if( "function" === typeof callback ){
                callback(page);
            }

        })


    }

    /*
    * 删除分页
    * */
    function hidePaging( dom ){
        $(dom).next('.page').remove();
    }


    //tree分页点击处理
    function treePageClick( page ){
        var data = {};
        data['currPage'] = page;

        if( ajaxSearch ){
            $.ajax({
                type: 'POST',
                url: _ajaxUrl,
                data: data,
                success:
                    function(data){
                        //初始化ztree
                        _self.zTreeInit(_setting, data.data);
                        _self.setPaging( data.page );
                        //self.setAjaxUrl( url );

                        if( _arrCheckId > 0 ){
                            var strCheckCompanyId = _arrCheckId.toString();
                            var arrCheckCompanyId = strCheckCompanyId.split();
                            _self.checkById('id', arrCheckCompanyId);
                        }

                        //显示tree
                        showMenu2( data.page );
                    },
                dataType: 'json'
            })
        }
    }

    //tip分页点击处理
    function tipPageClick( page ){
        var cate_fuzzy_value = $.trim($("#" + id_search ).val());
        var data = {};
        //搜索关键字post key name
        //console.log(ajaxSearchParam);
        var searchKey = ajaxSearchParam.searchKey;
        //var cb = ajaxSearchParam.cb;
        data[searchKey] = cate_fuzzy_value;
        data['currPage'] = page;
        //if( cb ){
        //    data['cb'] = cb;
        //}

        if( ajaxSearch ){
            $.ajax({
                type: 'POST',
                url: ajaxSearchParam.url,
                data: data,
                success:
                    function(data){

                        //console.log(data);
                        //返回结果加载到树
                        //onAjaxCallback( data );
                        //显示搜索提示
                        showSearchTip( data.data, data.page );

                    },
                dataType: 'json'
            })
        }
    }


    //下拉选择框分页
    var _paging = {'totalPage': 1, 'currPage': 1};

    //设置下拉选择框分页
    this.setPaging = _setPaging = function( paging ){
        _paging = paging;
    }

    //取得下拉选择框分页
    this.getPaging = _getPaging = function(){
        return _paging;
    }

    //设置下拉选择框分页获取url
    var _ajaxUrl = '';
    this.setAjaxUrl = _setAjaxUrl = function( url ){
        _ajaxUrl = url;
    }

    this.getAjaxUrl = _getAjaxUrl = function(){
        return _ajaxUrl;
    }

    /*
    * 初始化ztree下拉框（封装myselect初始化组件）
    * */
    var _setting = '';
    var _ajaxParam = '';
    var _arrCheckId = [];

    //保存自身对象
    var _self = this;

    this.init = function( param ){
        _setting = param.setting;
        _ajaxUrl = param.ajaxUrl;
        _ajaxParam = param.ajaxParam;
        _arrCheckId = param.arrCheckId;

        $.ajax({
            type: 'POST',
            url: _ajaxUrl,
            data: _ajaxParam,
            success:
                function(data){
                    //初始化ztree
                    _self.zTreeInit(_setting, data.data);
                    _self.setPaging( data.page );

                    if( _arrCheckId > 0 ){
                        var strCheckCompanyId = _arrCheckId.toString();
                        var arrCheckCompanyId = strCheckCompanyId.split();
                        _self.checkById('id', arrCheckCompanyId);
                    }

                },
            dataType: 'json'
        });


    }


    //点击body时的处理函数
    function onBodyDown(event) {
        if ( !( event.target.id == id_dropcontent
            || event.target.id == id_select_text
            || event.target.id == id_search
            || event.target.id == id_search_tip_container
            || event.target.id == id_search_tip_content
            || event.target.id == id_treecontainer
                //|| event.target.id.substr(-6) == 'switch'   //ztree树节点
//                || $(event.target).parents(divselector).length>0
//                || $(event.target).parents(".myselect").length>0
            || $(event.target).parents("#"+id_treecontainer).length>0
            || $(event.target).parents("#"+id_search_tip_container).length>0

            || event.target.id == id_dropcontent
            )
            || event.target.id == id_select_arrow
            || event.target.id == id_select_text

        ){
            if( isShowSearch() ){
                if( !showDropContentForevery ) {
                    hideSearchText();
                }
            }

            if( isShowMenu() ){
                if( !showDropContentForevery ) {
                    hideMenu();
                }
            }

            if( isShowSearchTip() ){
                hideSearchTip();
            }
        }
        return false;
    }


    //弹出层不在隐藏过程中
    var menuHiding = false;

    //文本域容器id
    var id_selectorInputDiv = divselectid + '_input';

    //文本域id
    var id_select = divselectid + "_select";

    //文本域id
    var id_select_text = divselectid + "_text";
    //选择值隐藏域id
    var id_select_values =  divselectid + "_values";
    //弹出层id
    var id_dropcontent = divselectid + "_dropcontent";
    //下来箭头id
    var id_select_arrow = divselectid + "_arrow";
    //查询框id
    var id_search = divselectid + "_search";

    //查询提示容器
    var id_search_tip_container = divselectid + "_search_tip_container";

    //查询提示内容
    var id_search_tip_content = divselectid + "_search_tip_content";

    //查询提示关闭按钮
    var id_search_tip_close = divselectid + "_search_tip_close";

    //搜索提示类标签
    var class_search_tip = divselectid + "_class_search_tip";

    //tree容器id
    var id_treecontainer = divselectid + "_container";
    //增加选择框按钮id
    var id_add_cateselect = divselectid + "_addcate";
    //删除选择框按钮id
    var id_del_cateselect = divselectid + "_delcate";


    var html = '<div id="' + id_selectorInputDiv + '" class="myselect">';
    html += '     <div id="' + id_select + '">';
    html += '     <input class="myselect-text" id="' + id_select_text + '" placeholder="' + placeholder + '" readonly/>';
    if( !showDropContentForevery ){
        html += '     <span class="myselect-arrow" id="' + id_select_arrow + '"></span>';
    }
    html += '     </div>';
    html += '     <div><input class="myselect-search search" id="' + id_search + '" placeholder="' + placeholder_search + '" style="display:none"/></div>';
    html += '</div>';

    //是否显示增加减少选择框按钮
    if( showAddDelButton ){
        html += '<span id="' + id_add_cateselect + '" style="font-size:25px;"> + </span><span id="' + id_del_cateselect + '"style="font-size:25px;"> - </span>';
    }

    //添加
    $( divselector ).prepend( html );

    //设置选择框宽度
    if( 'undefined' !== typeof config && 'undefined' !== typeof config.width ){
        $(divselector).find('.myselect').width(config.width);
    }




    //搜索提示
    var html="";
    html += '<div id="' + id_search_tip_container + '" style="display:none;">';
    html += '     <div id="' + id_search_tip_content + '" class="ztreedrop ztree box-max-height ">';
    html += '     </div>';
    html += '     <ul style="background:#cccccc"><span id="'  + id_search_tip_close +  '">关闭提示</span></ul>';
    html += "</div>";
    //弹出层实现（绝对定位）
    $("body").append(html);

    //下拉树形层容器
    var html="";
    html += '<div id="' + id_treecontainer + '" style="display:inline;">';
//        html += '<ul id="' + id_dropcontent + '" class="ztree" style="margin-top:0; width:180px; height: 300px; z-index: 1000; display: none; background-color: #EBEBEB"></ul>';
    html += '     <ul id="' + id_dropcontent + '" class="ztreedrop ztree box-max-height"></ul>';
    html += '     <input name="' + divselectid + '" type="hidden" value="" id="' + id_select_values + '"/>';
    html += "</div>";

    if( showDropContentForevery ){
        //永久显示树选择框（相对定位）
        //弹出层实现（内联）
        $( divselector ).after( html );
    }else{
        //弹出层实现（绝对定位）
        $("body").append(html);
    }

    //设置下拉框高度
    if( 'undefined' !== typeof config && 'undefined' !== typeof config.height ){
        $("#"+id_treecontainer).height(config.height);
    }
    //最大高度
    if( 'undefined' !== typeof config && 'undefined' !== typeof config.maxHeight ){
        $("#"+id_dropcontent).css('max-height', config.maxHeight);
    }

    //最小高度
    if( 'undefined' !== typeof config && 'undefined' !== typeof config.minHeight ){
        $("#"+id_dropcontent).css('min-height', config.minHeight);
    }

    if( !showDropContentForevery ){
        //绑定显示下拉框事件
        //var selectorInputDiv = divselector + '_input';
        $( "#"+id_selectorInputDiv ).mouseup(function(e){
//          console.log(e);
            //隐藏弹出层时触发click时,不显示弹出层
            if( menuHiding ){
                menuHiding = false;
                return false;
            }

            if( searchtext_flag ){
                //显示查询框时
                if( !isShowSearch() || true){
                    showSearchText();
                    //绝对定位
                    showMenu2( _paging );
                }else{
                    //隐藏查询框
                    hideSearchText();

                    //如果查询提示显示则关闭，并且不在执行后边判断（查询提示和下拉树形框只能二显一）
                    if( isShowSearchTip() ){
                        hideSearchTip();
                        //return false;
                    }else{
                        hideMenu();
                    }
                }

            }else{
                //var paging = _self.getPaging();
                showMenu2( _paging );
            }

            //if( !isShowMenu() ){
            //    //绝对定位
            //    showMenu2();
            //}else{
            //    hideMenu();
            //}
            return false;
        });

        //鼠标移出树形显示区
        function bind_treecontainer_hover(){
            $("#"+id_treecontainer).hover(
                function(){},
                function( e ){
                    //当前元素是否是被筛选元素的子元素
                    var isChild = $(e.relatedTarget).parents("#"+id_treecontainer).length > 0 ? true : false;

                    var isSearch = $(e.relatedTarget).parents("#"+id_search).length > 0 ? true : false;

                    //进入select div区域
                    var isDivselector = $(e.relatedTarget).parents(divselector).length > 0 ? true : false;

                    if( !isChild && !isSearch && !isDivselector  ){
                        if( isShowSearch() ){
                            hideSearchText();

                        }

                        if( isShowMenu() ){
                            hideMenu();

                        }
                    }
                    return false;
                }
            )
        }

        bind_treecontainer_hover();


        //鼠标移出提示区域
        function bind_tip_hover(){
            $("#"+id_search_tip_container).unbind('hover').hover(
                function(){},
                function( e ){
                    //console.log(e);
                    //当前元素是否是被筛选元素的子元素
                    var isChild = $(e.relatedTarget).parents("#"+id_search_tip_container).length > 0 ? true : false;

                    var isSearch = $(e.relatedTarget).parents("#"+id_search).length > 0 ? true : false;

                    //进入select div区域
                    var isDivselector = $(e.relatedTarget).is(divselector);

                    //关闭tip按钮
                    var isCloseTipButton = e.fromElement.id === id_search_tip_close ? true : false;


                    if( !isChild && !isSearch && !isDivselector && !isCloseTipButton){
                        if( isShowSearch() ){
                            if( !showDropContentForevery ){
                                if( !isShowMenu() ){
                                    hideSearchText();
                                }
                            }
                        }
                        if( isShowSearchTip() ){
                            hideSearchTip();
                        }

                    }
                    return false;
                }
            )

            //$(searchSelector).hover(
            //    function(){},
            //    function( e ){
            //        alert("test");
            //        //当前元素是否是被筛选元素的子元素
            //        console.log(e);
            //        console.log($(this));
            //        //内部
            //        var isChild = $(e.relatedTarget).parents("#"+id_search_tip_container).length > 0 ? true : false;
            //        //进入myselect区域(包括select+search)
            //        var isMySelectBox = $(e.relatedTarget).parents(divselector).length > 0 ? true : false;
            //        var isMySelectText = $(e.relatedTarget).parents(divselector).length > 0 ? true : false;
            //        var isMySelectBox = $(e.relatedTarget).parents(divselector).length > 0 ? true : false;
            //
            //
            //
            //        var isSearch = $(e.relatedTarget).parents("#"+id_search).length > 0 ? true : false;
            //        //进入select div区域
            //        var isDivselector = $(e.relatedTarget).is(divselector);
            //        if( !isChild && !isMySelectBox && !isDivselector){
            //            hideSearchText();
            //            hideSearchTip();
            //            //hideMenu();
            //        }
            //        return false;
            //    }
            //)


        }

        bind_tip_hover();

        //绑定divselect 鼠标离开事件
        function divselect_bind_hover(){
            $(divselector).hover(
                function(){},
                function( e ){
                    //当前元素是否是被筛选元素的子元素
                    //内部
                    var isChild = $(e.relatedTarget).parents("#"+id_select).length > 0 ? true : false;

                    // 进入树容器
                    var isTreeContainer = $(e.relatedTarget).parents("#"+id_treecontainer).length > 0 ? true : false;
                    //进入搜索提示容器
                    var isTipContainer = $(e.relatedTarget).parents("#"+id_search_tip_container).length > 0 ? true : false;

                    if( !isChild && !isTreeContainer && !isTipContainer){
                        if( isShowSearch() ){
                            hideSearchText();

                        }
                        if( isShowSearchTip() ){
                            hideSearchTip();

                        }

                        if( isShowMenu() ){
                            hideMenu();

                        }
                    }
                    return false;
                }
            )
        }

        bind_tip_hover();
        divselect_bind_hover();
        bind_tip_close_click();
    }else{
///////////
        if( searchtext_flag ){
            //显示查询框时
            if( !isShowSearch() || true){
                showSearchText();
                //相对定位
                showMenu( _paging );
            }else{
                //隐藏查询框
                hideSearchText();


                //如果查询提示显示则关闭，并且不在执行后边判断（查询提示和下拉树形框只能二显一）
                if( isShowSearchTip() ){
                    hideSearchTip();
                    //return false;
                }else{
                    hideMenu();
                }
            }

        }
        //////////////////////



        //var paging = _self.getPaging();
        showMenu( _paging );
    }


    //添加栏目点击事件
    $("#"+id_add_cateselect).bind("click",
        function( e ){
            console.log(e);
            //判断已有选择栏数目
            //var num = selCateObj.length+1;
            var num = _groupObj.length;
            if( num >= addMax ){
                alert( addTip );
            }else{
                //添加选择栏
                addSelectCate();
            }

            //阻止事件冒泡
            return false;
        }
    );


    //删除栏目点击事件
    $("#"+id_del_cateselect).click(function(){
        var num = _groupObj.length;
        if( num <= delMin ){
            alert( delTip );
        }else{
            var id = $(this).attr("id");
            var prefix = id.split("_");

            //取得下拉菜单编号
            var str = prefix[0].replace(/([^\d]+)(.*)/, "$1");
            var cateselect_num = prefix[0].replace(str, "");

            //删除选择栏（根据索引号）
            delSelectCate(cateselect_num-1);
        }
    });





    //绑定关闭搜索提示
    function bind_tip_close_click(){
        //关闭提示
        $("#" + id_search_tip_close).unbind("mouseup").mouseup(
            function(){


                //showSearchText();
                hideSearchTip();

                var paging = _self.getPaging();
                showMenu2( paging );


                return false;
            }
        )
    }


    function isShowMenu(){
        var display = $("#" + id_dropcontent).css("display");
        if( display == 'none' ){
            return false;
        }else{
            return true;
        }
    }

    function isShowSearchTip(){
        var display = $("#" + id_search_tip_container).css("display");
        if( display == 'none' ){
            return false;
        }else{
            return true;
        }
    }

    function isShowSearch(){
        var display = $("#" + id_search).css("display");
        if( display == 'none' ){
            return false;
        }else{
            return true;
        }
    }


}


/*
//下拉菜单对象数组
selCateObj = [];

//下拉菜单索引记录数组
cateselect_ids = [];

//创建下拉菜单
function addSelectCate(){
    //div模拟下拉菜单(select)jquery插件调用
    //是否存在下拉菜单删除
    var exist_catedel_flag = false;
    //cateselect_ids全局变量
    for(var i=0,len=cateselect_ids.length; i<len; i++ ){
        if( undefined == cateselect_ids[i]){
            //有被删除的下拉菜单
            exist_catedel_flag = true;
            break;
        }
    }


    //添加index记录
    var catesel_index=0;
    if( exist_catedel_flag ){
        //取前一数组元素值加1作为新索引值
        //应禁止删除第一个下拉菜单
//        catesel_index = cateselect_ids[i] = cateselect_ids[i-1] + 1 ;
//        catesel_index = i;
        catesel_index = cateselect_ids[i] = cateselect_ids[i-1] + 1 ;
    }else{
        //取最后一个数组元素值加1,存入数组
        if( len == 0 ){
            catesel_index = 0;
        }else{
            catesel_index = cateselect_ids[cateselect_ids.length-1] + 1;
        }
        cateselect_ids.push( catesel_index );
    }

    //菜单编号
    cate_num = catesel_index + 1;

    //选择框id
    var domid = "company" + cate_num;

    //添加选择catediv
    var res = $(".form-group:has('.cateselect')");
    var html = "";
    html += '<div class="form-group categroup">';
    html += '<label for="exampleInputEmail1">企业名称' + cate_num + '</label>';
    html += '<div class="cateselect" id="' + domid + '" >';
    html += '</div>';
    html += '</div>';

    //添加dom节点到第i个位置
    if( exist_catedel_flag ){
        if( i <= res.length-1 ){
            $(res[i-1]).after(html);
        }else{
            $(res[res.length-1]).after(html);
        }
    }else{
        $(res[res.length-1]).after(html);
    }

    var config = {};
//    config.onCheckCallback = getAreaByCheckCate;
    config.showAddDelButton = true;
    var tmpobj = new $.mydivselect("#"+domid, config);

    //添加对象
    if( exist_catedel_flag ){
        //插入对象根据第一次删除的对象索引
        selCateObj.splice(i, 0, tmpobj);
    }else{
        selCateObj.push(tmpobj);
    }

    //更新标题
    var catesel_laber = $(".categroup label");
    for(var i=0; i < catesel_laber.length; i++ ){
        $(catesel_laber[i]).text("企业名称"+(i+1));
    }


    //新加企业选项初始化
    if( 'undefined' !== typeof obj ){
        var setting_cate1 = {
            check: {
                enable: true,
                chkStyle: "radio",
//                        chkType: "check"
                radioType: "all"
            },
            view: {
                showIcon: false,
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                },
                key: {
                    name: "text"
                }
            },
            callback: {
                beforeClick: selCateObj[cate_num-1].beforeClick,
                onCheck: selCateObj[cate_num-1].onCheck,
            }
        };
        var ztreeid = selCateObj[cate_num-1].getZtreeId();
        $.fn.zTree.init( $("#"+ztreeid), setting_cate1, obj );
    }

}

*/
/*
 * 删除
 * catesel_index:下拉菜单索引值
 *
 * *//*

function delSelectCate(catesel_index){
    var catenum = catesel_index + 1;
    var cateid = "#company"+ catenum ;

    //取得选择栏dom元素的索引号
    var pos = $(".categroup").index( $(cateid).parent() );

    //销毁选择器对象中的ztree对象
    selCateObj[pos].destroy();

    //删除选择器对象
    selCateObj.splice(pos,1);

    //删除选择器dom容器
    $($(".categroup")[pos]).remove();

    //删除下拉菜单索引记录
    delete cateselect_ids[catesel_index];

    //更新标题
    var catesel_laber = $(".categroup label");
    for(var i=0; i < catesel_laber.length; i++ ){
        $(catesel_laber[i]).text("企业名称"+(i+1));
    }
}*/
