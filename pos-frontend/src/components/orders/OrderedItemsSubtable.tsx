import { Package } from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";
import type { SaleItem } from "@/store/api/orderApi";

const OrderedItemsSubtable = ({ orderedItems }: { orderedItems: SaleItem[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="w-16">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          {/* <TableHead>Category</TableHead> */}
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-center">ordered quantity</TableHead>
          {/* <TableHead className="text-center">Status</TableHead> */}
          {/* <TableHead className="text-right">Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          orderedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Package className="w-12 h-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orderedItems.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.product.sku}</TableCell>
                  {/* <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell> */}
                  <TableCell className="text-right font-medium">৳{item.product.price}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  {/* <TableCell className="text-center">
                              <Badge
                                className={cn(
                                  status === 'in-stock' && 'bg-success/10 text-success border-success/20',
                                  status === 'low-stock' && 'bg-warning/10 text-warning border-warning/20',
                                  status === 'out-of-stock' && 'bg-destructive/10 text-destructive border-destructive/20'
                                )}
                                variant="outline"
                              >
                                {status === 'in-stock' && 'In Stock'}
                                {status === 'low-stock' && 'Low Stock'}
                                {status === 'out-of-stock' && 'Out of Stock'}
                              </Badge>
                            </TableCell> */}
                  {/* <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingProduct(product)}
                                  className='cursor-pointer'
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive cursor-pointer"
                                  onClick={() => setDeletingProduct(product)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell> */}
                </TableRow>
              )
            })
          )}

      </TableBody>
    </Table>
  );
};

export default OrderedItemsSubtable;