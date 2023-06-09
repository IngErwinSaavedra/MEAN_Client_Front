import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  productForm: FormGroup;
  title = 'create product';
  id: string | null;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productService: ProductsService,
    private aRouter: ActivatedRoute) {
    this.productForm = this.fb.group({
      product: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isEdit();
  }

  addProduct() {
    const PRODUCT: Product = {
      name: this.productForm.get('product')?.value,
      category: this.productForm.get('category')?.value,
      location: this.productForm.get('location')?.value,
      price: this.productForm.get('price')?.value,
    }

    console.log(PRODUCT);
    this._productService.saveProduct(PRODUCT).subscribe(data =>   {
      this.toastr.success('The product was saved successfully', 'Product Registered!');
      this.router.navigate(['/']);
    }, error => {
      console.log(error);
      this.productForm.reset();
    })
  }

  isEdit() {
    if (this.id !== null) {
      this.title = 'Edit Product';
      this._productService.getProduct(this.id).subscribe(data => {
        this.productForm.setValue({
          product: data.name,
          category: data.category,
          location: data.location,
          price: data.price
        })
      })
    }
  }
}
