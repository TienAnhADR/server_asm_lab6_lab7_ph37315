const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User')
const argon2 = require('argon2')
var fs = require('fs')
// đăng ký POST http://localhost:3000/auth/register
router.post('/register', async (req, res) => {
    console.log('Register');
    const { username, password } = req.body
    let avatar = ''
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Không để trống' })
    try {
        const checkUser = await UserSchema.findOne({ username })
        if (checkUser) return res.status(402).json({ success: false, message: 'Username Đã tồn tại' })
        const hanshedPassword = await argon2.hash(password)
        console.log(req.file.path);
        if (fs.existsSync(req.file.path)) {
            let file_path = './public/images/' + req.file.originalname
            console.log(req.file);
            if (req.file.mimetype.indexOf('image') == -1)
                return res.status(400).json({ success: false, message: 'Lỗi định dạng ảnh' })
            fs.renameSync(req.file.path, file_path)
            avatar = 'http://10.0.2.2:3000/images/' + req.file.originalname

        } else {
            return res.status(404).json({ success: false, message: 'Không có file upload' })
        }
        const newUser = new UserSchema({ username, password: hanshedPassword, avatar })
        console.log(newUser);
        const check = await newUser.save()
        if (!check) return res.status(400).json({ success: false, message: 'Lỗi đăng ký' })
        res.status(200).json({ success: true, message: 'Đăng ký thành công', data: check })
    } catch (error) {
        console.log('Lỗi Đăng ký: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})


// Đăng nhập GET http://localhost:3000/login
router.post('/login', async (req, res) => {
    
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ success: false, message: 'Không để trống' })
    try {
        const checkUser = await UserSchema.findOne({ username })
        if (!checkUser) return res.status(402).json({ success: false, message: 'Tài khoản này không có vui lòng đăng ký' })
        const checkPass = await argon2.verify(checkUser.password, password)
        if (!checkPass) return res.status(402).json({ success: false, message: 'Sai password' })
        console.log(checkUser);
        res.status(200).json({ success: true, message: 'Đăng nhập thành công', data: checkUser })
    } catch (error) {
        console.log('Lỗi Đăng ký: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server' })
    }
})
module.exports = router