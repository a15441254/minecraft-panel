const Service = require('egg').Service;
const Mysql = require('../../src/mysql/connection')
const Response = require('../../src/response')
const fs = require('fs')
const crypto = require('crypto')
const Logs = require('../../src/logger')
const Logger = new Logs()
class UserService extends Service {
    md5(val) {
        return crypto.createHash('md5').update(val).digest('hex')
    }
    async getUserList() {
        let mysql = new Mysql()
        let res = await mysql.action('select user_id,player_id,login_ip,role_name as role from user,role where user.role_id = role.role_id')
        return new Response({code: 1, msg: '查询成功', data : res})
    }
    async updatePassword(options) {
        let mysql = new Mysql()
        let oldInfo = await mysql.action('select * from user where user_id = ?', options.userId)
        if(oldInfo[0].password == this.md5(options.oldPassword)){
            let res = await mysql.action('update user set password = ? where user_id = ?', [this.md5(options.password), options.userId])
            if(res){
                Logger.log(this.ctx, `修改密码：${[this.md5(options.password), options.userId].join(',')}`)
           
