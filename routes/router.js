/* GET /edit/:id: Hiển thị form chỉnh sửa xe */
router.get('/edit/:id', async function (req, res, next) {
    try {
        const car = await Car.findById(req.params.id); // Tìm xe theo ID
        if (!car) {
            return res.status(404).send("Car not found");
        }
        res.render('edit', { title: 'Edit Car', car }); // Gửi dữ liệu xe tới form edit
    } catch (err) {
        console.error("Error fetching car for edit:", err);
        res.status(500).send("Error fetching car for edit");
    }
});
