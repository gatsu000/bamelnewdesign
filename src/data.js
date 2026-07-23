import { Droplets, ScanLine, Shirt, Sparkles, Wind, Workflow } from 'lucide-react'

export const services = [
  {
    slug: 'gomlek-uretimi',
    title: 'Gömlek Üretimi',
    icon: Shirt,
    label: 'Kesimden paketlemeye',
    summary: 'Model, kalıp, kumaş ve işçilik kararlarını aynı üretim akışında değerlendiriyoruz.',
    image: '/images/textile/shirt-production.webp',
    steps: ['Model ve referansın değerlendirilmesi', 'Kumaş, kalıp ve aksesuarların netleştirilmesi', 'Uygun projelerde numune planı', 'Üretim, kontrol ve paketleme']
  },
  {
    slug: 'nakis',
    title: 'Nakış',
    icon: Sparkles,
    label: 'Marka detayları',
    summary: 'Logo, monogram ve desenleri kumaşla uyumlu biçimde planlıyoruz.',
    image: '/images/textile/industrial-embroidery.webp',
    steps: ['Dosya ve uygulama alanının incelenmesi', 'İplik, renk ve kumaş uyumunun değerlendirilmesi', 'Konum ve ölçü için numune yaklaşımı', 'Tekrarlanabilir uygulama kontrolü']
  },
  {
    slug: 'kumas-boyama',
    title: 'Kumaş Boyama',
    icon: Droplets,
    label: 'Renk ve parti yaklaşımı',
    summary: 'Hedef renk ve kumaş yapısına göre numune ile parti tutarlılığını birlikte ele alıyoruz.',
    image: '/images/textile/fabric-dyeing.webp',
    steps: ['Kumaş türü ve hedef rengin alınması', 'Referans veya numune değerlendirmesi', 'İşlem planı ve renk kontrolü', 'Kurutma ve sonraki aşama koordinasyonu']
  },
  {
    slug: 'yikama',
    title: 'Yıkama',
    icon: Workflow,
    label: 'Tuşe ve görünüm',
    summary: 'Ürün tipi, kumaş yapısı ve hedef görünümü form korumayı gözeterek değerlendiriyoruz.',
    image: '/images/textile/garment-washing.webp',
    steps: ['Ürün ve kumaş yapısının değerlendirilmesi', 'Hedef görünüm ile tuşenin netleştirilmesi', 'Yıkama planı ve hassasiyet notları', 'Sonraki işlem için kontrollü geçiş']
  },
  {
    slug: 'sikma',
    title: 'Sıkma',
    icon: ScanLine,
    label: 'Kontrollü geçiş',
    summary: 'Islak işlem sonrası ürünleri bir sonraki aşamaya kontrollü biçimde hazırlıyoruz.',
    image: '/images/textile/hydro-extraction.webp',
    steps: ['Önceki işlem durumunun değerlendirilmesi', 'Kumaş hassasiyeti ve hedefin belirlenmesi', 'Nem azaltma yaklaşımının planlanması', 'Kurutma veya sonraki aşamaya hazırlık']
  },
  {
    slug: 'kurutma',
    title: 'Kurutma',
    icon: Wind,
    label: 'Form ve denge',
    summary: 'Kumaş hassasiyeti, form ve hedef nem dengesini birlikte ele alan kurutma yaklaşımı.',
    image: '/images/textile/textile-drying.webp',
    steps: ['Kumaş ve ürün hassasiyetinin değerlendirilmesi', 'Önceki işlem bilgisinin alınması', 'Kurutma koşullarının planlanması', 'Sonraki üretim adımına hazırlık']
  }
]

export const processSteps = [
  ['01', 'Talebi dinliyoruz', 'Ürün, hizmet, adet ve hedef tarihi ilk çerçeveye alıyoruz.'],
  ['02', 'Detayı okuyoruz', 'Kumaş, model, renk, dosya ve işlem uygunluğunu birlikte inceliyoruz.'],
  ['03', 'Numuneyi netleştiriyoruz', 'Uygun projelerde beklentiyi somutlaştıracak numune akışını planlıyoruz.'],
  ['04', 'Üretimi akıtıyoruz', 'Onaylanan kapsam üzerinden planlama, kontrol ve teslim adımlarını koordine ediyoruz.']
]

export const faqs = [
  ['Minimum sipariş adedi nedir?', 'Siparişin kapsamına göre değişir. Ürün tipi, adet, kumaş ve işlem ayrıntılarını paylaşmanızın ardından uygun planlama değerlendirilir.'],
  ['Numune çalışması yapılıyor mu?', 'Numune ihtiyacı hizmete ve proje kapsamına göre değerlendirilir. Model, kumaş ve beklentilerinizi ilk talebinizde paylaşabilirsiniz.'],
  ['Termin nasıl belirlenir?', 'Termin; adet, malzeme, işlem adımları ve mevcut üretim planı dikkate alınarak değerlendirilir. Kapsam netleşmeden kesin tarih verilmez.'],
  ['Nakış için hangi dosya gerekir?', 'Logo veya desen dosyası incelenir. Üretime uygun dosya biçimi ve gerekli ek bilgiler teknik değerlendirmede bildirilir.']
]
