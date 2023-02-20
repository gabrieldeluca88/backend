class ProductsDTO {
    constructor({ _id, title, price, thumbnail, descripcion, stock }) {
        this.id = _id
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
        this.descripcion = descripcion,
        this.stock = stock
    }
}

function asDto(prods) {
    if(Array.isArray(prods))
        return prods.map(p => new ProductsDTO(p))
    else
        return new ProductsDTO(prods)
}

module.exports={ProductsDTO, asDto};