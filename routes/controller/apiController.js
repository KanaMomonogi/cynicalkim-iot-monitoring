const Company = require('../../models').Company
const Place = require('../../models').Place
const Sensor = require('../../models').Sensor
const Log = require('../../models').Log
let crypto = require("crypto")
const sequelize = require('../../models').sequelize;
//센서 입력
module.exports.sensorAdd = async (req, res) => {
    console.log(req.body)
    try {
        let companyIdx = await Company.findAll({
            attributes: ['COMPANY_IDX'],
            where: {
                COMPANY_NAME: req.body.companyName
            }
        }).then(model => {
            if (model.length == 0) {
                return Company.create({
                    COMPANY_NAME: req.body.companyName,
                    REG_DE: new Date(Date.now()).toISOString()
                }).then(model => {
                    return model.COMPANY_IDX
                });
            }
            else {
                return model[0].COMPANY_IDX
            }
        })

        let placeIdx = await Place.findAll({
            attributes: ['PLACE_IDX'],
            where: {
                COMPANY_IDX: companyIdx,
                PLACE_NAME: req.body.placeName
            }
        }).then(model => {
            if (model.length == 0) {
                return Place.create({
                    COMPANY_IDX: companyIdx,
                    PLACE_NAME: req.body.placeName,
                    REG_DE: new Date(Date.now()).toISOString()
                }).then(model => {
                    return model.PLACE_IDX
                });
            }
            else {
                return model[0].PLACE_IDX
            }
        })
        //console.log(await tokenGenerator())
        let sensor = await Sensor.create({
            PLACE_IDX: placeIdx,
            SENSOR_NAME: req.body.sensorName,
            SENSOR_OPTION: req.body.sensorOption,
            SENSOR_TOKEN: await tokenGenerator(),
            REG_DE: new Date(Date.now()).toISOString()
        }).then(model => {
            return model.PLACE_IDX
        });

        res.status(200).json({
            sensor: await sensor,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({
            result: "fail"
        });
    }
}

//센서 리스트
module.exports.sensorList = async (req, res) => {
    try {
        var model = Company.findAll({
            raw: true
        }).then(async model => {
            let place = []
            model.forEach((el, idx) => {
                var info = Place.findAll(
                    {
                        where: { COMPANY_IDX: el.COMPANY_IDX },
                        raw: true
                    })
                    .then(async place => {
                        let sensorList = []
                        place.forEach((el, idx) => {
                            var sensor = Sensor.findAll({
                                where: { PLACE_IDX: el.PLACE_IDX },
                                raw: true
                            })
                            sensorList.push(sensor)
                        })
                        const sensor = await Promise.all(sensorList)
                        var sensorPromises = []
                        for (var j = 0; j < sensor.length; j++) {
                            sensorPromises.push(sensor[j]);
                        }
                        var merge = []
                        for (var k = 0; k < place.length; k++) {
                            place[k]['SENSOR'] = sensorPromises[k]
                            merge.push(place[k])
                        }
                        return Promise.all(merge);
                    })
                place.push(info);
            });

            const models = await Promise.all(place);
            //const sensor = await Promise.all(sensorList);
            //console.log(sensor)
            var userPromises = [];
            for (var j = 0; j < models.length; j++) {
                userPromises.push(models[j]);
            }
            var merge = []
            for (var k = 0; k < model.length; k++) {
                model[k]['PLACE'] = userPromises[k]
                merge.push(model[k])
            }
            return Promise.all(merge);

        }).then(model => {
            return model
        })
        res.status(200).json({
            //sensorList: await sensorList,
            data: await model,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
//센서 상세정보
module.exports.sensorDetail = async (req, res) => {
    try {
        console.log(req.params.sensor)
        var logState = 'SELECT\n' 
        logState    +='company.COMPANY_NAME,\n'
        logState    +='place.PLACE_NAME,\n'
        logState    +='sensor.SENSOR_NAME, \n'
        logState    +='log.REG_DE,\n'
        logState    +='log.TEMP, \n'
        logState    +='log.HUMI\n'
        logState    +='FROM log\n'
        logState    +='LEFT JOIN sensor\n'
        logState    +='ON\n'
        logState    +='log.SENSOR_IDX = sensor.SENSOR_IDX\n'
        logState    +='LEFT JOIN place\n'
        logState    +='ON\n'
        logState    +='sensor.PLACE_IDX = place.PLACE_IDX\n' 
        logState    +='LEFT JOIN company\n' 
        logState    +='ON\n' 
        logState    +='place.COMPANY_IDX = company.COMPANY_IDX\n'
        logState    +='WHERE\n'
        logState    +='log.SENSOR_IDX = $sensorIdx\n'
        var log = await sequelize.query(logState,{
            bind:{
                sensorIdx:req.params.sensor
            }
        }).then(model => {
           return model[0]
        })

        var sensorDetail = 'SELECT\n' 
        sensorDetail    +='company.COMPANY_NAME,\n'
        sensorDetail    +='place.PLACE_NAME,\n'
        sensorDetail    +='sensor.SENSOR_NAME, \n'
        sensorDetail    +='sensor.SENSOR_OPTION,\n'
        sensorDetail    +='sensor.SENSOR_TOKEN\n'
        sensorDetail    +='FROM sensor\n'
        sensorDetail    +='LEFT JOIN place\n'
        sensorDetail    +='ON\n'
        sensorDetail    +='sensor.PLACE_IDX = place.PLACE_IDX\n'
        sensorDetail    +='LEFT JOIN company\n'
        sensorDetail    +='ON\n'
        sensorDetail    +='place.COMPANY_IDX = company.COMPANY_IDX\n'
        sensorDetail    +='WHERE\n'
        sensorDetail    +='sensor.SENSOR_IDX = $sensorIdx\n'
        var info = await sequelize.query(sensorDetail,{
            bind:{
                sensorIdx:req.params.sensor
            }
        }).then(model => {
           return model[0]
        })
        res.status(200).json({
            info:await info[0],
            log:await log,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
//센서 수정
module.exports.sensorUpdate = async (req, res) => {
    try {
        console.log(req.body)
        Sensor.update({
            SENSOR_OPTION:req.body.sensorOption,
            UPDATE_DE: new Date(Date.now()).toISOString()
        },{
            where:{
               SENSOR_IDX:req.params.sensor
            }
        }).then(result =>{
            res.status(200).json({
                result: "success"
            });
        });
                
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
//센서 삭제
module.exports.sensorDelete = async (req, res) => {
    try {
        console.log(req.params.sensor)
        Log.destroy({
            where: {
                SENSOR_IDX: req.params.sensor
            }
        }).then(result =>{
            Sensor.destroy({
                where: {
                    SENSOR_IDX: req.params.sensor
                }
            }).then(result =>{
                res.status(200).json({
                    result: "success"
                });
            })
        })
        
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
//센서 로그 삭제
module.exports.sensorLogDelete = async (req, res) => {
    try {
        console.log(req.params.sensor)
        Log.destroy({
            where: {
                SENSOR_IDX: req.params.sensor
            }
        }).then(result =>{
            res.status(200).json({
                result: "success"
            });
        })
        
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
//로그 입력
module.exports.logAdd = async (req, res) => {
    try {

        let sensorIdx = await Sensor.findAll({
            attributes: ['SENSOR_IDX'],
            where: {
                SENSOR_TOKEN: req.body.device
            }
        }).then(model => {
            console.log(model[0].SENSOR_IDX)
            let logValue = req.body.data
            logValue.forEach(element => {
                let valueArr = element.value.split(',')
                let temp = valueArr[0].split(':')[1]
                let humi = valueArr[1].split(':')[1]
                Log.create({
                    SENSOR_IDX:model[0].SENSOR_IDX,
                    TEMP:temp,
                    HUMI:humi,
                    REG_DE:new Date(Date.now()).toISOString()
                })    
            });
            
        })

        res.status(200).json({
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({
            result: "fail"
        });
    }
}

module.exports.logList = async (req, res) => {
    try {
        var logState = 'SELECT\n' 
        logState    +='company.COMPANY_NAME,\n'
        logState    +='place.PLACE_NAME,\n'
        logState    +='sensor.SENSOR_NAME, \n'
        logState    +='log.REG_DE,\n'
        logState    +='log.TEMP, \n'
        logState    +='log.HUMI\n'
        logState    +='FROM log\n'
        logState    +='LEFT JOIN sensor\n'
        logState    +='ON\n'
        logState    +='log.SENSOR_IDX = sensor.SENSOR_IDX\n'
        logState    +='LEFT JOIN place\n'
        logState    +='ON\n'
        logState    +='sensor.PLACE_IDX = place.PLACE_IDX\n' 
        logState    +='LEFT JOIN company\n' 
        logState    +='ON\n' 
        logState    +='place.COMPANY_IDX = company.COMPANY_IDX\n'
        var log = await sequelize.query(logState).then(model => {
           return model[0]
        })
        res.status(200).json({
            //sensorList: await sensorList,
            log: await log,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
module.exports.allLogDelete = async (req, res) => {
    try {
        Log.destroy({ truncate: true })
        res.status(200).json({
            //sensorList: await sensorList,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}
module.exports.allDataDelete = async (req, res) => {
    try {
        Company.destroy({ truncate: true })
        Place.destroy({ truncate: true })
        Sensor.destroy({ truncate: true })
        Log.destroy({ truncate: true })
        res.status(200).json({
            //sensorList: await sensorList,
            result: "success"
        });
    }
    catch (error) {
        console.log(error)
        res.status(200).json({

            result: "fail"
        });
    }
}

async function tokenGenerator() {
    try {

        let token = crypto.randomBytes(20).toString('hex')
        return Sensor.count({
            where: {
                SENSOR_TOKEN: token
            }
        }).then(cnt => {
            console.log(cnt)
            if (cnt != 0) {
                tokenGenerator()
            }
            return token
        })
    }
    catch (error) {
        console.log(error)
    }
} 
