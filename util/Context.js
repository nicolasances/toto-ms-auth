const Logger = require('toto-logger');
const moment = require('moment-timezone')

const newCid = () => {

    let ts = moment().tz("Europe/Rome").format('YYYYMMDDHHmmssSSS');

    let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

    return ts + '-' + random;

}

class Context {

    setExecutionContext(execContext) { this.execContext = execContext }

    getLogger() {

        if (this.execContext && this.execContext.logger) return this.execContext.logger;

        return new Logger("auth");
    }

    getCid() {

        if (this.execContext && this.execContext.cid) return this.execContext.cid;

        if (this.cid) return this.cid;

        this.cid = newCid();

        return this.cid;

    }

    isDebugEnabled() {
        return true;
    }

}

exports.context = new Context();