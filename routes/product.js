const express = require('express')
const router = express.Router()
const ProductSchema = require('../models/Product')
const fs = require('fs')


router.post('/', async (req, res) => {
    const { namePro, pricePro } = req.body
    let image = '';
    if (!namePro || !pricePro) return res.status(400).json({ success: false, message: 'Không để trống thông tin', data: [] })
    try {
        console.log(req.file.path);
        if (fs.existsSync(req.file.path)) {
            let file_path = `./public/images/${req.file.originalname}`
            console.log(req.file);
            if (req.file.mimetype.indexOf('image') == -1)
                return res.status(400).json({ success: false, message: 'lỗi định dạng ảnh', data: [] })
            fs.renameSync(req.file.path, file_path)
            image = `http://10.0.2.2:3000/images/${req.file.originalname}`
        }
        else {
            return res.status(404).json({ success: false, message: 'Không có ảnh upload', data: [] })
        }
        const newPro = new ProductSchema({ namePro, pricePro, image })
        const check = await newPro.save()
        if (!check) return res.status(400).json({ success: false, message: 'Lỗi thêm product', data: [] })
        const data = await ProductSchema.find()
        res.status(200).json({ success: true, message: 'Thêm sản phẩm thành công', data })
    } catch (error) {
        console.log('Lỗi Sever: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })
    }
})


router.get('/', async (req, res) => {
    console.log('Vao get list');
    try {
        const data = await ProductSchema.find()
        if (!data) return res.status(400).json({ success: false, message: 'Lỗi lấy danh sách sản phẩm', data: [] })
        res.status(200).json({ success: true, message: 'Lấy danh sách sản phẩm thành công', data })
    } catch (error) {
        console.log('Lỗi Sever: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })

    }
})
router.delete('/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const deletePro = await ProductSchema.findByIdAndDelete({ _id })
        if (!deletePro) return res.status(401).json({ success: false, message: 'Lỗi xóa sản phẩm id sản phẩm không đúng', data: [] })
        const data = await ProductSchema.find()
        if (!data) return res.status(400).json({ success: false, message: 'Đã xóa thành công, lỗi data rỗng vui lòng thêm mới', data: [] })
        res.status(200).json({ success: true, message: 'Xóa thành công ', data })
    } catch (error) {
        console.log('Lỗi Sever: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })

    }
})
router.put('/:id', async (req, res) => {
    console.log('Vao day');
    const _id = req.params.id
    const { namePro, pricePro } = req.body
    console.log('name: ',namePro);
    console.log('price: ',pricePro);

    const imageFile = req.file
    let image = '';
    if (!namePro || !pricePro) return res.status(400).json({ success: false, message: 'Không để trống thông tin', data: [] })
    if (isNaN(pricePro)) {
        return res.status(400).json({ success: false, message: 'pricePro phải là một số', data: [] })
    }

    try {

        if (fs.existsSync(imageFile.path)) {
            let file_path = `./public/images/${imageFile.originalname}`
            if (imageFile.mimetype.indexOf('image') == -1)
                return res.status(400).json({ success: false, message: 'lỗi định dạng ảnh', data: [] })
            fs.renameSync(imageFile.path, file_path)
            image = `http://10.0.2.2:3000/images/${imageFile.originalname}`
        }
        else {
            return res.status(404).json({ success: false, message: 'Không có ảnh upload', data: [] })
        }
        const productUP = await ProductSchema.findByIdAndUpdate({ _id }, { namePro, pricePro, image }, { new: true })
        if (!productUP) return res.status(400).json({ success: false, message: 'Không tìm thấy sản phẩm có id trên', data: [] })
        const data = await ProductSchema.find()
        if (!data) return res.status(403).json({ success: false, message: 'Đã cập nhật sản phẩm , lỗi lấy lại danh sách sản phẩm', data: [] })
        res.status(201).json({ success: true, message: 'Update sản phẩm thành công', data })
    } catch (error) {
        console.log('Lỗi Sever: ', error);
        res.status(500).json({ success: false, message: 'Lỗi server', data: [] })

    }
})
module.exports = router