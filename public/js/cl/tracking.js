var clTracking = (function () {
    var trackUrlMap = {
        ['app.convertlab.com']: '//cbe.convertlab.com/cbe/collect?tid=1238467299&at=0&h=web',
        ['app.dmhub.cn']: '//cbe.convertwork.cn/cbe/collect?tid=1707707909279546996&at=0&h=web',
        ['app.convertwork.cn']: '//cbe.convertwork.cn/cbe/collect?tid=1238467299&at=0&h=web',
    };

    var trackOpenPage = function () {
        $.ajax({url: '/application/components/URLs.json'}).then(function (data) {
            var urls = [];
            $(data).each(function (i, group) {
                $(group.children).each(function (_, category) {
                    $(category.children).each(function (_, urlObj) {
                        if (!urlObj.full) {
                            var url = '';
                            if (group.url) {
                                url += group.url;
                            }
                            if (category.url) {
                                url += category.url;
                            }
                            if (urlObj.url) {
                                url += urlObj.url;
                            }
                            urlObj.url = url;
                        }

                        if (urlObj.url === '/index.html') {
                            urlObj.url = location.host + urlObj.url;
                        }

                        urlObj.group = group.label;
                        urlObj.category = category.label;
                        urls.push(urlObj);
                    });
                });
            });

            var track = function () {
                var currentUrl = location.href;
                if (currentUrl.indexOf('/application/page/pages.html') > -1) {
                    currentUrl = location.href.replace(location.search, '');
                }

                var i = 0;
                for (; i < urls.length; i++) {
                    var urlObj = urls[i];
                    if (currentUrl.indexOf(urlObj.url) > -1) {
                        console.log(urlObj);
                        clab_tracker.track('c_dmhub_open_page', {
                            group: urlObj.group,
                            category: urlObj.category,
                            content: urlObj.label,
                        });
                        break;
                    }
                }
            };

            track();
            window.onhashchange = track;
        });
    };

    var _loadTrackingScript = function (url, callback){
        var script = document.createElement ('script');
        script.type = 'text/javascript';
        if (script.readyState){ //IE
            script.onreadystatechange = function(){
                if (script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function(){
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return function (user) {
        if(trackUrlMap[location.host]){
            _loadTrackingScript(trackUrlMap[location.host],function(){
                clab_tracker.ready(function(){
                    this.push({
                        targetName: document.title,
                        pageTitle: document.title,
                        fromTenantId: user.tenantId,
                        fromTenantName: user.company,
                        supportUser: user.isSupportUser ? user.loginName : '',
                        identityType: "dmhub",
                        identityValue: user.loginName
                    });

                    trackOpenPage();
                });
            });
            // only track once;
            trackUrlMap[location.host] = '';
        }
    };
})();
