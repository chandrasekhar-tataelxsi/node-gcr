
export default class Bootstrap {

    constructor(app) {
       this.createServer(app);
    }

    createServer (app) {
        app.listen(3025, () => {
            console.log(`Example app listening on port 3025`)
          })
    }
}