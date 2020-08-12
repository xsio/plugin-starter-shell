/**
 * Created by huangling on 1/12/2017.
 */

const compileProps = {
    'pageTemplate/index': {
        title: '自定义模板',
    },
    'floweditorV2/index': {
        title: '自动流程列表',
        css: ['/css/icon-workflow.css', 'icon-member', '/node_modules/jsplumb/dist/css/jsPlumbToolkit-defaults.css'],
        plugin: ['/node_modules/jsplumb/dist/js/jsPlumb-2.1.3-min.js'],
        customPlugin: ['/node_modules/convertlab-scaffold/lib/index.js'],
    },
    'floweditorV2/editorlite': {
        title: '自动流程预览',
        css: ['/css/icon-workflow.css', 'icon-member', '/node_modules/jsplumb/dist/css/jsPlumbToolkit-defaults.css'],
        plugin: ['/node_modules/jsplumb/dist/js/jsPlumb-2.1.3-min.js'],
        customPlugin: ['/node_modules/convertlab-scaffold/lib/index.js'],
    },
    'wechat/index': {
        title: '微信',
    },
    'wechat/channelSetting': {
        title: '微信公众号设置',
    },
    'retargeting/index': {
        title: '再投放',
    },
    'webhook/list': {
        title: 'Webhook',
    },
    'targetgroup/index': {
        title: '群组列表',
    },
    'customer/index': {
        title: '客户',
        css: ['/css/icon-workflow.css'],
    },
    // 'customer/profile': {
    //     title: '客户详情',
    //     css: ['/css/icon-workflow.css'],
    // },
    'push/index': {
        title: '消息推送',
        css: ['style', 'main'],
    },
    'import/index': {
        title: '数据导入导出',
    },
    'equitymanage/equity': {
        title: '权益库管理',
    },
    'membership/index': {
        title: '会员管理',
        plugin: ['/js/lib/less/less.1.7.0.min.js', '/js/lib/jsonExportExcel/jsonExportExcel.min.js'],
    },

    'plugin/invitacard/edit': {
        title: '定向邀请函',
        css: ['bootstrap', 'style', 'main'],
    },
    'plugin/invitacard/list': {
        title: '定向邀请函',
        css: ['bootstrap', 'style', 'main'],
    },

    'plugin/refer/customers': {
        title: '客户',
        css: ['style', 'main'],
    },
    'plugin/refer/private': {
        title: '全员推广',
        plugin: ['/js/lib/less/less.1.7.0.min.js', '/js/lib/jsonExportExcel/jsonExportExcel.min.js'],
    },
    'plugin/refer/public': {
        title: '分享裂变',
        css: ['style', 'main'],
        plugin: ['/js/lib/less/less.1.7.0.min.js'],
    },
    'wechatcorp/index': {
        title: '企业微信',
        css: ['style', 'main'],
    },
    'wechatcorp/customers': {
        title: '客户列表',
        css: ['style', 'main'],
    },
    'pagev2/pagev2': {
        title: '微页面',
        css: ['/css/pagev2/editor.css',
            '/node_modules/codemirror/lib/codemirror.css',
            '/node_modules/codemirror/theme/monokai.css'],
        plugin: ['/js/lib/less/less.1.7.0.min.js',
            '/node_modules/jquery.easing/jquery.easing.1.3.js',
            '/node_modules/components-jquery-htmlclean/jquery.htmlClean.js'],
    },
    'page/pages': {
        title: '微页面列表',
    },
    'page/customers': {
        title: '微页面客户详情',
        css: ['style', 'main'],
    },
    'dataMonitor/game': {
        title: 'H5游戏',
    },
    'sms/list': {
        title: '短信列表',
        plugin: ['/js/lib/ckeditor/ckeditor.js'],
    },
    'email/list': {
        title: '邮件列表',
        plugin: ['/js/lib/ckeditor/ckeditor.js'],
    },
    'email/view': {
        title: '预览EMail',
    },
    'setting/app': {
        title: '应用设置',
    },
    'setting/permission_setting': {
        title: '权限管理',
    },
    'setting/customer': {
        title: '客户设置 － 其他设置',
    },
    'setting/contenttagsv2': {
        title: '客户设置 － 其他设置',
    },
    'setting/AprSetting': {
        title: '客户设置 － 流程等级设置',
    },
    'setting/statcustomer': {
        title: '设置中心 - 客户指标',
    },
    'source/index': {
        title: '来源管理',
    },
    'implementation_guide/setting': {
        title: '设置中心',
    },
    'implementation_guide/website': {
        title: '设置中心-网站',
    },
    'implementation_guide/liveness': {
        title: '设置中心',
    },
    'implementation_guide/stage': {
        title: '客户设置 － 客户阶段',
    },
    'implementation_guide/identity': {
        title: '客户设置 － 客户身份',
    },
    'index': {
        title: '首页',
        css: ['/node_modules/react-dates/lib/css/_datepicker.css'],
        filePath: ''
    },
    'login': {
        title: '登录',
        filePath: '',
    },
    'customer/setting/props': {
        title: '客户属性',
    },
    'customer/setting/order': {
        title: '订单设置',
    },
    'customer/value/index': {
        title: '客户价值评分',
    },
    'customer/tag/tag_management': {
        title: '客户标签',
    },
    'account/accountSetting': {
        title: '账户设置',
    },
    'task/index': {
        title: '任务',
    },
    'qq/callback': {
        title: '绑定腾讯广告投放平台账号',
    },
    'mktcmpV2/index': {
        title: '营销活动',
        css: ['bootstrap', 'style', 'main', '/css/bak/font-awesome.min.css', '/css/icon-workflow.css', '/node_modules/intro.js/introjs.css', '/node_modules/jsplumb/dist/css/jsPlumbToolkit-defaults.css', '/node_modules/react-dates/lib/css/_datepicker.css'],
        plugin: ['/node_modules/intro.js/minified/intro.min.js', '/node_modules/jsplumb/dist/js/jsPlumb-2.1.3-min.js'],
        customPlugin: ['/node_modules/convertlab-scaffold/lib/index.js'],
    },
    'mktcmpV3/index': {
        title: '营销活动3',
        css: [
            '/css/icon-workflow.css',
            '/node_modules/intro.js/introjs.css',
            '/node_modules/jsplumb/dist/css/jsPlumbToolkit-defaults.css',
            '/node_modules/react-dates/lib/css/_datepicker.css',
            '/css/react-table.css'
        ],
        plugin: ['/node_modules/intro.js/minified/intro.min.js', '/node_modules/jsplumb/dist/js/jsPlumb-2.1.3-min.js'],
        customPlugin: ['/node_modules/convertlab-scaffold/lib/index.js'],
    },
    'mktapp/index': {
        title: '营销应用',
    },
    'dataMonitor/index': {
        title: '数据监测',
        plugin: ['/js/lib/less/less.1.7.0.min.js']
    },
    'masterdata/index': {
        title: '主数据管理',
        css: ['style', 'main'],
    },
    'luckyDraw/index': {
        title: '抽奖活动管理',
    },
    'goods/index': {
        title: '在用商品管理',
    },
    'rule/index': {
        title: '规则引擎',
    },
    'mktcmp/list': {
        title: '营销活动1.0'
    },
    'mktcmp/campaign_template': {
        title: '营销活动-模版'
    },
    'invitationV2/index': {
        title: '用户邀请'
    },
    'ad/index': {
        title: '广告'
    },
    'redeemcard/index': {
        title: '核销助手' // will be move out later
    }
};

const cssMap = {
    bootstrap: '/css/bak/bootstrap.3.3.7.min.css',
    style: '/css/style.css',
    main: '/css/main.css',
    'icon-member': '/css/icon-member.css',
};

function normalize(value) {
    return value !== undefined ?
        Array.isArray(value) ?
            value :
            [value] :
        [];
}

for (var key in compileProps) {
    const config = compileProps[key];
    config.plugin = normalize(config.plugin);
    config.customPlugin = normalize(config.customPlugin);
    config.css = normalize(config.css).map(css => cssMap[css] || css);
}

module.exports = compileProps;
