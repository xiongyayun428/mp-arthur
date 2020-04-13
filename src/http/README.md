# 微信小程序网络请求封装

## 使用
```
const http = new DefaultHttp({
  withBaseURL: true,
  baseURL: "https://api.prolinkwm.com",
  successCode: ["000000"],
  codeFieldName: "rtnCode",
  msgFieldName: "rtnMsg",
  dataFieldName: "rtnData"
});
http.debug = true;
http.handler = new DefaultHandler();
http.handler = new MyDefaultHandler();

http.get("/gateway/common/dict/getAll")
    .then((data: any) => console.log("success", data), (err: any) => console.error("error", err))
    .finally(() => console.log("finally"))
```
