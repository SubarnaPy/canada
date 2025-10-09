import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { CartItem, useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    coverImage?: string;
    thumbnail?: string;
    type: 'ebook' | 'course';
    salesCount?: number;
  };
  onPreview: () => void;
}

export function ProductCard({ product, onPreview }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      type: product.type,
      price: product.price,
      coverImage: product.coverImage,
      thumbnail: product.thumbnail,
    };
    addToCart(cartItem);
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:-translate-y-2 animate-fade-in">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.coverImage || product.thumbnail || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover Preview Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={onPreview}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 text-foreground">
              {product.title}
            </h3>
            <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20">
              {product.type === 'ebook' ? 'E-book' : 'Course'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>
            {product.salesCount !== undefined && product.salesCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {product.salesCount} sold
              </div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
