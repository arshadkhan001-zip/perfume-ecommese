import { FormEvent, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  Instagram,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react'

type Product = {
  id: number
  name: string
  brand: string
  image: string
  category: string
  mood: string
  price: number
  original: number
  rating: number
  reviews: number
  badge?: string
  notes: string
}

const products: Product[] = [
  { id: 1, name: 'Midnight Oud Elixir', brand: 'NOIR ATELIER', image: '/images/perfume-hero.jpg', category: 'Men', mood: 'Intense', price: 2499, original: 3999, rating: 4.7, reviews: 1284, badge: 'Bestseller', notes: 'Oud · Amber · Saffron' },
  { id: 2, name: 'Bloom Eau de Parfum', brand: 'MAISON ELARA', image: '/images/perfume-2.jpg', category: 'Women', mood: 'Romantic', price: 1899, original: 2899, rating: 4.5, reviews: 876, badge: 'Trending', notes: 'Rose · Peony · Musk' },
  { id: 3, name: 'Ombre Leather Intense', brand: 'TOM FORD', image: '/images/perfume-3.jpg', category: 'Men', mood: 'Intense', price: 8999, original: 10999, rating: 4.8, reviews: 532, badge: 'Luxury pick', notes: 'Leather · Jasmine · Patchouli' },
  { id: 4, name: 'Imperial Gold Parfum', brand: 'REGALIA', image: '/images/perfume-4.jpg', category: 'Unisex', mood: 'Elegant', price: 3299, original: 4999, rating: 4.6, reviews: 693, notes: 'Vanilla · Amber · Cedar' },
  { id: 5, name: 'Citrus No. 07', brand: 'APOTHECARY CO.', image: '/images/perfume-1.jpg', category: 'Unisex', mood: 'Fresh', price: 1499, original: 2199, rating: 4.4, reviews: 418, badge: 'New', notes: 'Bergamot · Neroli · Vetiver' },
  { id: 6, name: 'Velvet Rose Mist', brand: 'MAISON ELARA', image: '/images/perfume-2.jpg', category: 'Women', mood: 'Romantic', price: 1299, original: 1999, rating: 4.3, reviews: 322, notes: 'Rosewater · Lychee · Musk' },
  { id: 7, name: 'Dark Reserve Cologne', brand: 'NOIR ATELIER', image: '/images/perfume-3.jpg', category: 'Men', mood: 'Elegant', price: 2799, original: 4299, rating: 4.6, reviews: 764, notes: 'Tobacco · Tonka · Woods' },
  { id: 8, name: 'Golden Hour Extrait', brand: 'REGALIA', image: '/images/perfume-4.jpg', category: 'Unisex', mood: 'Warm', price: 3699, original: 5499, rating: 4.7, reviews: 954, badge: 'Editor’s pick', notes: 'Honey · Amber · Sandalwood' },
]

const categories = [
  { label: 'All perfumes', icon: '✦' },
  { label: 'Women', icon: '♀' },
  { label: 'Men', icon: '♂' },
  { label: 'Unisex', icon: '◇' },
  { label: 'Luxury', icon: '♛' },
  { label: 'Gift sets', icon: '▣' },
  { label: 'Minis', icon: '◌' },
  { label: 'New arrivals', icon: '↗' },
]

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Popular')
  const [wishlist, setWishlist] = useState<number[]>([2])
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const [orderComplete, setOrderComplete] = useState(false)

  const filteredProducts = useMemo(() => {
    const found = products.filter((product) => {
      const text = `${product.name} ${product.brand} ${product.notes}`.toLowerCase()
      return text.includes(query.toLowerCase()) && (category === 'All' || product.category === category || product.mood === category)
    })
    return [...found].sort((a, b) => sort === 'Price: Low to High' ? a.price - b.price : sort === 'Rating' ? b.rating - a.rating : b.reviews - a.reviews)
  }, [query, category, sort])

  const cartItems = products.filter((product) => cart[product.id])
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item, 0)
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)
  const savings = cartItems.reduce((sum, product) => sum + (product.original - product.price) * cart[product.id], 0)

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }))
    notify(`${product.name} added to bag`)
  }

  const toggleWishlist = (id: number) => {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    notify(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) => {
      const next = (current[id] || 0) + delta
      const updated = { ...current }
      if (next <= 0) delete updated[id]
      else updated[id] = next
      return updated
    })
  }

  const selectCategory = (value: string) => {
    const next = value === 'All perfumes' || ['Luxury', 'Gift sets', 'Minis', 'New arrivals'].includes(value) ? 'All' : value
    setCategory(next)
    setMobileOpen(false)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reset()
    notify('Welcome to the Aurum Circle!')
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#141a22]">
      <div className="bg-[#f59e0b] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#101820] sm:text-xs">
        <span className="inline-flex items-center gap-2"><Sparkles size={13} /> Fragrance Week: Up to 40% off + extra 10% with AURUM10</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f1d2b] text-white shadow-xl shadow-slate-950/10">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-4 lg:px-8">
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
          <button className="flex shrink-0 items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="grid size-9 rotate-45 place-items-center rounded-[10px] border border-[#f4b544] bg-[#f4b544] text-[#101820]"><Sparkles className="-rotate-45" size={20} fill="currentColor" /></span>
            <span className="font-serif text-[24px] font-semibold tracking-[0.13em]">AURUM</span>
          </button>

          <div className="mx-auto hidden max-w-2xl flex-1 overflow-hidden rounded-lg bg-white shadow-inner md:flex">
            <button className="flex items-center gap-2 border-r border-slate-200 px-4 text-xs font-bold text-slate-700" onClick={() => selectCategory('All perfumes')}>Perfumes <ChevronDown size={14} /></button>
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 text-slate-400" size={19} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="h-11 w-full bg-transparent pl-12 pr-4 text-sm text-slate-900 outline-none" placeholder="Search perfumes, brands and notes" />
              {query && <button onClick={() => setQuery('')} className="absolute right-3 text-slate-400"><X size={17} /></button>}
            </div>
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#f4b544] px-5 text-[#101820] transition hover:bg-[#ffc85b]" aria-label="Search"><Search size={19} /></button>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button onClick={() => notify('Sign-in is ready for your account')} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-white/10 xl:flex">
              <CircleUserRound size={22} />
              <span><span className="block text-[10px] text-slate-400">Hello, sign in</span><span className="block text-xs font-bold">Account</span></span>
            </button>
            <button onClick={() => notify('No active orders yet')} className="hidden rounded-lg px-3 py-2 text-left transition hover:bg-white/10 lg:block">
              <span className="block text-[10px] text-slate-400">Track your</span><span className="block text-xs font-bold">Orders</span>
            </button>
            <button onClick={() => notify(`${wishlist.length} item${wishlist.length === 1 ? '' : 's'} in your wishlist`)} className="relative rounded-lg p-2.5 transition hover:bg-white/10" aria-label="Wishlist">
              <Heart size={21} />{wishlist.length > 0 && <span className="absolute right-1 top-0 grid size-4 place-items-center rounded-full bg-[#f4b544] text-[9px] font-black text-[#101820]">{wishlist.length}</span>}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 rounded-lg p-2.5 transition hover:bg-white/10" aria-label="Shopping bag">
              <ShoppingBag size={22} />{cartCount > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-[#f4b544] text-[9px] font-black text-[#101820]">{cartCount}</span>}
              <span className="hidden text-xs font-bold sm:block">Bag</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10 lg:hidden">
              <div className="space-y-3 p-4">
                <div className="relative md:hidden"><Search className="absolute left-3 top-3 text-slate-500" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full rounded-lg bg-white pl-10 pr-4 text-sm text-slate-900 outline-none" placeholder="Search perfumes..." /></div>
                <div className="grid grid-cols-2 gap-2">{categories.map((item) => <button key={item.label} onClick={() => selectCategory(item.label)} className="rounded-lg border border-white/10 px-3 py-2 text-left text-sm hover:bg-white/10">{item.icon} &nbsp;{item.label}</button>)}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 overflow-x-auto px-4 py-3 scrollbar-hide lg:px-8">
          {categories.map((item) => (
            <button key={item.label} onClick={() => selectCategory(item.label)} className="group flex shrink-0 items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#b36a00]">
              <span className="grid size-7 place-items-center rounded-full bg-[#f5efe3] text-sm text-[#b36a00] transition group-hover:bg-[#f4b544] group-hover:text-[#101820]">{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-[1440px] gap-4 p-4 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-6">
          <div className="relative min-h-[430px] overflow-hidden rounded-2xl bg-[#122433] text-white shadow-sm lg:min-h-[470px]">
            <img src="/images/perfume-hero.jpg" alt="Midnight Oud perfume bottle" className="absolute inset-0 size-full object-cover object-center opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09131d] via-[#0b1825]/90 to-transparent" />
            <div className="relative z-10 flex min-h-[430px] max-w-[680px] flex-col justify-center p-7 sm:p-12 lg:min-h-[470px] lg:p-16">
              <span className="mb-5 w-fit rounded-full border border-[#f4b544]/50 bg-[#f4b544]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#f6bf5b]">New season · Midnight collection</span>
              <h1 className="max-w-xl font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">Leave a lasting <em className="font-normal text-[#f4b544]">impression.</em></h1>
              <p className="mt-6 max-w-md text-sm leading-6 text-slate-300 sm:text-base">Discover rare notes, iconic bottles and fragrances chosen to become your signature.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => selectCategory('All perfumes')} className="flex items-center gap-2 rounded-lg bg-[#f4b544] px-6 py-3.5 text-sm font-black text-[#101820] transition hover:-translate-y-0.5 hover:bg-[#ffc75b]">Shop collection <ArrowRight size={17} /></button>
                <button onClick={() => setQuickView(products[0])} className="rounded-lg border border-white/30 px-6 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white hover:text-[#101820]">Explore the scent</button>
              </div>
            </div>
            <div className="absolute bottom-5 right-5 hidden items-center gap-2 sm:flex"><button className="grid size-9 place-items-center rounded-full border border-white/30 bg-black/20"><ChevronLeft size={17} /></button><button className="grid size-9 place-items-center rounded-full bg-white text-slate-900"><ChevronRight size={17} /></button></div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <button onClick={() => selectCategory('Women')} className="group relative min-h-[190px] overflow-hidden rounded-2xl bg-[#ead8d0] text-left lg:min-h-0">
              <img src="/images/editorial.jpg" alt="Woman wearing perfume" className="absolute inset-0 size-full object-cover object-[center_35%] transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd27f]">Curated for her</p><h2 className="mt-1 font-serif text-2xl">The floral edit</h2><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold">Shop now <ArrowRight size={13} /></span></div>
            </button>
            <div className="relative min-h-[190px] overflow-hidden rounded-2xl bg-[#e8e3d8] p-5 lg:min-h-0">
              <div className="relative z-10 max-w-[160px]"><span className="rounded bg-[#b92d36] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">Limited time</span><h2 className="mt-3 font-serif text-2xl leading-none">Deal of the day</h2><p className="mt-2 text-xs text-slate-600">Up to 40% off select fragrances</p><div className="mt-4 flex gap-1.5 text-center">{['08h','42m','17s'].map((time) => <span key={time} className="rounded bg-white px-2 py-1.5 text-[10px] font-black shadow-sm">{time}</span>)}</div></div>
              <img src="/images/perfume-1.jpg" alt="Perfume bottles" className="absolute -bottom-7 -right-8 h-[85%] w-[58%] rotate-[-4deg] object-cover mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-slate-200 px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
            {[{ icon: Truck, title: 'Free delivery', sub: 'On orders over ₹999' }, { icon: BadgeCheck, title: '100% authentic', sub: 'Sourced from brands' }, { icon: PackageCheck, title: 'Easy returns', sub: '7-day return policy' }, { icon: Headphones, title: 'Scent concierge', sub: 'Expert help, 7 days' }].map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-4 py-5 sm:justify-center"><item.icon className="shrink-0 text-[#b36a00]" size={24} strokeWidth={1.6} /><div><p className="text-xs font-black">{item.title}</p><p className="mt-0.5 text-[10px] text-slate-500">{item.sub}</p></div></div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b36a00]">Loved by thousands</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">Trending right now</h2></div>
            <button onClick={() => selectCategory('All perfumes')} className="hidden items-center gap-1 border-b border-slate-900 pb-1 text-xs font-black sm:flex">View all <ArrowRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {filteredProducts.length ? filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} liked={wishlist.includes(product.id)} onLike={() => toggleWishlist(product.id)} onAdd={() => addToCart(product)} onView={() => setQuickView(product)} />
            )) : <div className="col-span-full rounded-2xl bg-white py-20 text-center"><Search className="mx-auto text-slate-300" size={40} /><h3 className="mt-4 font-serif text-2xl">No scents found</h3><p className="mt-2 text-sm text-slate-500">Try a different brand, note or category.</p><button onClick={() => { setQuery(''); setCategory('All') }} className="mt-5 rounded-lg bg-[#101820] px-5 py-3 text-xs font-bold text-white">Clear filters</button></div>}
          </div>
        </section>

        <section className="bg-[#e9e4d9] py-14 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="mb-8 text-center"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b36a00]">Find your feeling</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">Shop by mood</h2></div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {[{ mood: 'Fresh', copy: 'Bright & effortless', img: '/images/perfume-1.jpg', color: 'bg-[#c8d9d4]' }, { mood: 'Romantic', copy: 'Soft & enchanting', img: '/images/perfume-2.jpg', color: 'bg-[#edcfd3]' }, { mood: 'Intense', copy: 'Deep & magnetic', img: '/images/perfume-3.jpg', color: 'bg-[#b8aaa1]' }, { mood: 'Elegant', copy: 'Rich & refined', img: '/images/perfume-4.jpg', color: 'bg-[#d9c79d]' }].map((item) => (
                <button key={item.mood} onClick={() => selectCategory(item.mood)} className={`${item.color} group relative aspect-[4/5] overflow-hidden rounded-2xl text-left`}>
                  <img src={item.img} alt={`${item.mood} fragrances`} className="absolute inset-0 size-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101820]/85 to-transparent p-5 pt-16 text-white"><h3 className="font-serif text-2xl sm:text-3xl">{item.mood}</h3><p className="mt-1 text-xs text-white/70">{item.copy}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-black opacity-0 transition group-hover:opacity-100">Explore <ArrowRight size={13} /></span></div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-28 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b36a00]">The fragrance hall</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">Discover your signature</h2><p className="mt-2 text-xs text-slate-500">{filteredProducts.length} handpicked fragrances</p></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3"><SlidersHorizontal size={15} /><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 bg-transparent text-xs font-bold outline-none"><option>All</option><option>Women</option><option>Men</option><option>Unisex</option><option>Fresh</option><option>Romantic</option><option>Intense</option><option>Elegant</option></select></div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold outline-none"><option>Popular</option><option>Rating</option><option>Price: Low to High</option></select>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {filteredProducts.map((product) => <ProductCard key={`all-${product.id}`} product={product} liked={wishlist.includes(product.id)} onLike={() => toggleWishlist(product.id)} onAdd={() => addToCart(product)} onView={() => setQuickView(product)} />)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#142536] text-white">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
            <div className="relative min-h-[380px] lg:min-h-[520px]"><img src="/images/editorial.jpg" alt="The art of choosing a signature scent" className="absolute inset-0 size-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#142536]/30" /></div>
            <div className="flex flex-col justify-center px-7 py-14 sm:px-14 lg:px-20"><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4b544]">The Aurum journal</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">How to find a scent that feels like you</h2><p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">From skin chemistry to fragrance families, our experts simplify the art of choosing a perfume you’ll reach for every day.</p><button onClick={() => notify('The scent guide has been saved to your reading list')} className="mt-8 flex w-fit items-center gap-2 border-b border-[#f4b544] pb-2 text-xs font-black text-[#f4b544]">Read the scent guide <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <section className="bg-[#f4b544] px-4 py-12 text-[#101820]">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left"><div><h2 className="font-serif text-3xl">Join the Aurum Circle</h2><p className="mt-1 text-sm">Get ₹300 off your first order and early access to new drops.</p></div><form onSubmit={submitNewsletter} className="flex w-full max-w-md overflow-hidden rounded-lg bg-white"><input required type="email" placeholder="Your email address" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" /><button className="bg-[#101820] px-5 text-xs font-black text-white">Join now</button></form></div>
        </section>
      </main>

      <footer className="bg-[#0c151e] px-4 pb-8 pt-14 text-slate-400 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2"><div className="flex items-center gap-2 text-white"><span className="grid size-8 rotate-45 place-items-center rounded-lg bg-[#f4b544] text-[#101820]"><Sparkles className="-rotate-45" size={17} /></span><span className="font-serif text-xl tracking-[0.15em]">AURUM</span></div><p className="mt-5 max-w-xs text-xs leading-6">India’s destination for authentic fine fragrances, cult classics and hidden gems.</p><div className="mt-5 flex gap-2"><button onClick={() => notify('Instagram coming right up')} className="grid size-9 place-items-center rounded-full border border-white/15 hover:text-white"><Instagram size={16} /></button><button onClick={() => notify('Customer care: 1800-202-2025')} className="grid size-9 place-items-center rounded-full border border-white/15 hover:text-white"><Headphones size={16} /></button></div></div>
          {[{ title: 'Shop', links: ['Women', 'Men', 'Unisex', 'Luxury', 'Gift sets'] }, { title: 'Help', links: ['My account', 'Track order', 'Returns', 'Shipping', 'Contact us'] }, { title: 'About', links: ['Our story', 'Authenticity', 'Journal', 'Careers', 'Stores'] }].map((column) => <div key={column.title}><h3 className="text-xs font-black uppercase tracking-wider text-white">{column.title}</h3><ul className="mt-5 space-y-3 text-xs">{column.links.map((link) => <li key={link}><button onClick={() => link === 'Women' || link === 'Men' || link === 'Unisex' ? selectCategory(link) : notify(`${link} selected`)} className="hover:text-white">{link}</button></li>)}</ul></div>)}
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 pt-7 text-[10px] sm:flex-row"><p>© 2025 Aurum Fragrances. All rights reserved.</p><div className="flex flex-wrap items-center gap-4"><span className="flex items-center gap-1"><CreditCard size={14} /> Secure payments</span><span className="flex items-center gap-1"><Banknote size={14} /> Cash on delivery</span><button>Privacy</button><button>Terms</button></div></div>
      </footer>

      <AnimatePresence>
        {cartOpen && <CartDrawer items={cartItems} quantities={cart} total={cartTotal} savings={savings} onClose={() => setCartOpen(false)} onUpdate={updateQuantity} onCheckout={() => { setCart({}); setOrderComplete(true); setCartOpen(false) }} />}
        {quickView && <QuickView product={quickView} liked={wishlist.includes(quickView.id)} onClose={() => setQuickView(null)} onLike={() => toggleWishlist(quickView.id)} onAdd={() => { addToCart(quickView); setQuickView(null) }} />}
        {orderComplete && <OrderSuccess onClose={() => setOrderComplete(false)} />}
        {toast && <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#101820] px-5 py-3 text-xs font-bold text-white shadow-2xl"><BadgeCheck size={17} className="text-[#f4b544]" />{toast}</motion.div>}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({ product, liked, onLike, onAdd, onView }: { product: Product; liked: boolean; onLike: () => void; onAdd: () => void; onView: () => void }) {
  const discount = Math.round((1 - product.price / product.original) * 100)
  return (
    <motion.article layout className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="relative aspect-[4/4.5] overflow-hidden bg-[#f1eee8]">
        <button onClick={onView} className="block size-full"><img src={product.image} alt={product.name} className="size-full object-cover transition duration-500 group-hover:scale-105" /></button>
        {product.badge && <span className="absolute left-2.5 top-2.5 rounded bg-[#101820] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:text-[9px]">{product.badge}</span>}
        <button onClick={onLike} className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 sm:right-3 sm:top-3" aria-label="Save to wishlist"><Heart size={16} className={liked ? 'fill-[#c83f4d] text-[#c83f4d]' : 'text-slate-700'} /></button>
        <button onClick={onView} className="absolute inset-x-3 bottom-3 hidden rounded-lg bg-white/95 py-2.5 text-[10px] font-black uppercase tracking-wider shadow-lg transition hover:bg-[#101820] hover:text-white sm:block lg:translate-y-14 lg:group-hover:translate-y-0">Quick view</button>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2"><p className="truncate text-[8px] font-black tracking-[0.16em] text-slate-400 sm:text-[9px]">{product.brand}</p><span className="flex shrink-0 items-center gap-0.5 text-[9px] font-bold"><Star size={10} fill="#eaa522" strokeWidth={0} /> {product.rating}</span></div>
        <button onClick={onView} className="mt-1.5 line-clamp-1 text-left text-xs font-bold sm:text-sm">{product.name}</button>
        <p className="mt-1 hidden truncate text-[10px] text-slate-500 sm:block">{product.notes}</p>
        <div className="mt-3 flex flex-wrap items-baseline gap-1.5"><span className="text-sm font-black sm:text-base">{money(product.price)}</span><span className="text-[9px] text-slate-400 line-through sm:text-[10px]">{money(product.original)}</span><span className="text-[9px] font-black text-emerald-700 sm:text-[10px]">{discount}% off</span></div>
        <button onClick={onAdd} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#101820] py-2.5 text-[10px] font-black uppercase tracking-wide transition hover:bg-[#101820] hover:text-white"><ShoppingBag size={13} /> Add to bag</button>
      </div>
    </motion.article>
  )
}

function QuickView({ product, liked, onClose, onLike, onAdd }: { product: Product; liked: boolean; onClose: () => void; onLike: () => void; onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-[#071019]/75 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: .95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .96, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-2">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow"><X size={18} /></button>
        <div className="aspect-square bg-[#eeeae2] sm:aspect-auto"><img src={product.image} alt={product.name} className="size-full object-cover" /></div>
        <div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-[9px] font-black tracking-[0.2em] text-[#b36a00]">{product.brand}</p><h2 className="mt-3 font-serif text-3xl">{product.name}</h2><div className="mt-3 flex items-center gap-2"><span className="flex items-center gap-1 rounded bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white">{product.rating} <Star size={9} fill="currentColor" /></span><span className="text-[10px] text-slate-500">{product.reviews.toLocaleString()} verified reviews</span></div><p className="mt-6 text-xs leading-6 text-slate-600">An expressive, long-lasting composition built around {product.notes.toLowerCase()}. Designed for an unforgettable trail, day or night.</p><div className="mt-4 rounded-lg bg-[#f6f4ef] p-3"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Scent notes</p><p className="mt-1 text-xs font-bold">{product.notes}</p></div><div className="mt-6 flex items-baseline gap-2"><span className="text-2xl font-black">{money(product.price)}</span><span className="text-xs text-slate-400 line-through">{money(product.original)}</span></div><p className="mt-1 text-[10px] text-slate-500">Inclusive of all taxes · Free delivery</p><div className="mt-6 flex gap-2"><button onClick={onAdd} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#101820] py-3.5 text-xs font-black text-white"><ShoppingBag size={16} /> Add to bag</button><button onClick={onLike} className="grid size-11 place-items-center rounded-lg border border-slate-300"><Heart size={18} className={liked ? 'fill-[#c83f4d] text-[#c83f4d]' : ''} /></button></div></div>
      </motion.div>
    </motion.div>
  )
}

function CartDrawer({ items, quantities, total, savings, onClose, onUpdate, onCheckout }: { items: Product[]; quantities: Record<number, number>; total: number; savings: number; onClose: () => void; onUpdate: (id: number, delta: number) => void; onCheckout: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[70] bg-[#071019]/60 backdrop-blur-sm">
      <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5"><div><h2 className="font-serif text-2xl">Your bag</h2><p className="text-[10px] text-slate-500">{items.length} unique item{items.length === 1 ? '' : 's'}</p></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-slate-100"><X size={18} /></button></div>
        {items.length ? <><div className="flex-1 space-y-4 overflow-y-auto p-5">{items.map((product) => <div key={product.id} className="flex gap-4 border-b border-slate-100 pb-4"><img src={product.image} alt={product.name} className="size-24 rounded-lg bg-slate-100 object-cover" /><div className="min-w-0 flex-1"><p className="text-[8px] font-black tracking-wider text-slate-400">{product.brand}</p><h3 className="mt-1 truncate text-xs font-bold">{product.name}</h3><p className="mt-2 text-sm font-black">{money(product.price)}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-lg border border-slate-200"><button onClick={() => onUpdate(product.id, -1)} className="p-1.5"><Minus size={12} /></button><span className="w-6 text-center text-[10px] font-bold">{quantities[product.id]}</span><button onClick={() => onUpdate(product.id, 1)} className="p-1.5"><Plus size={12} /></button></div><button onClick={() => onUpdate(product.id, -quantities[product.id])} className="text-slate-400 hover:text-red-600"><Trash2 size={15} /></button></div></div></div>)}</div><div className="border-t border-slate-200 bg-[#f8f7f3] p-5"><div className="mb-4 rounded-lg bg-emerald-50 p-3 text-[10px] font-bold text-emerald-800">You save {money(savings)} on this order</div><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Subtotal</span><span className="text-xl font-black">{money(total)}</span></div><p className="mt-1 text-right text-[9px] text-slate-400">Shipping calculated at checkout</p><button onClick={onCheckout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f4b544] py-4 text-xs font-black text-[#101820]">Secure checkout <ShieldCheck size={16} /></button></div></> : <div className="grid flex-1 place-items-center p-8 text-center"><div><div className="mx-auto grid size-20 place-items-center rounded-full bg-[#f6f4ef]"><ShoppingBag size={32} className="text-slate-400" /></div><h3 className="mt-5 font-serif text-2xl">Your bag is empty</h3><p className="mt-2 text-xs text-slate-500">A beautiful fragrance is only a spritz away.</p><button onClick={onClose} className="mt-6 rounded-lg bg-[#101820] px-6 py-3 text-xs font-bold text-white">Continue shopping</button></div></div>}
      </motion.aside>
    </motion.div>
  )
}

function OrderSuccess({ onClose }: { onClose: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-[#071019]/70 p-4 backdrop-blur-sm"><motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"><div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><PackageCheck size={30} /></div><h2 className="mt-5 font-serif text-3xl">Order confirmed!</h2><p className="mt-3 text-xs leading-5 text-slate-500">Your fragrances are being prepared with care. A confirmation has been sent to your email.</p><div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#f6f4ef] p-3 text-[10px] font-bold"><Clock3 size={14} /> Estimated delivery: 3–5 days</div><button onClick={onClose} className="mt-6 w-full rounded-lg bg-[#101820] py-3 text-xs font-black text-white">Continue shopping</button></motion.div></motion.div>
}

export default App
