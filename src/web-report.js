var defaultReport = require('web-report/defaultReport');
var webReportConfig = __webReportConfig__;
if (webReportConfig)
    defaultReport(webReportConfig);
else
    console.log("Cannot determine web report config.");
