import { Droplets, ScanLine, Shirt, Sparkles, Wind, Workflow } from 'lucide-react'

export const services = [
  {
    slug: 'gomlek-uretimi',
    title: 'Gömlek Üretimi',
    icon: Shirt,
    label: 'Kesimden paketlemeye',
    summary: 'Model, kalıp, kumaş ve işçilik kararlarını aynı üretim akışında değerlendiriyoruz.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85',
    steps: ['Model ve referansın değerlendirilmesi', 'Kumaş, kalıp ve aksesuarların netleştirilmesi', 'Uygun projelerde numune planı', 'Üretim, kontrol ve paketleme']
  },
  {
    slug: 'nakis',
    title: 'Nakış',
    icon: Sparkles,
    label: 'Marka detayları',
    summary: 'Logo, monogram ve desenleri kumaşla uyumlu biçimde planlıyoruz.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1600&q=85',
    steps: ['Dosya ve uygulama alanının incelenmesi', 'İplik, renk ve kumaş uyumunun değerlendirilmesi', 'Konum ve ölçü için numune yaklaşımı', 'Tekrarlanabilir uygulama kontrolü']
  },
  {
    slug: 'kumas-boyama',
    title: 'Kumaş Boyama',
    icon: Droplets,
    label: 'Renk ve parti yaklaşımı',
    summary: 'Hedef renk ve kumaş yapısına göre numune ile parti tutarlılığını birlikte ele alıyoruz.',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1600&q=85',
    steps: ['Kumaş türü ve hedef rengin alınması', 'Referans veya numune değerlendirmesi', 'İşlem planı ve renk kontrolü', 'Kurutma ve sonraki aşama koordinasyonu']
  },
  {
    slug: 'yikama',
    title: 'Yıkama',
    icon: Workflow,
    label: 'Tuşe ve görünüm',
    summary: 'Ürün tipi, kumaş yapısı ve hedef görünümü form korumayı gözeterek değerlendiriyoruz.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=85',
    steps: ['Ürün ve kumaş yapısının değerlendirilmesi', 'Hedef görünüm ile tuşenin netleştirilmesi', 'Yıkama planı ve hassasiyet notları', 'Sonraki işlem için kontrollü geçiş']
  },
  {
    slug: 'sikma',
    title: 'Sıkma',
    icon: ScanLine,
    label: 'Kontrollü geçiş',
    summary: 'Islak işlem sonrası ürünleri bir sonraki aşamaya kontrollü biçimde hazırlıyoruz.',
    image: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?auto=format&fit=crop&w=1600&q=85',
    steps: ['Önceki işlem durumunun değerlendirilmesi', 'Kumaş hassasiyeti ve hedefin belirlenmesi', 'Nem azaltma yaklaşımının planlanması', 'Kurutma veya sonraki aşamaya hazırlık']
  },
  {
    slug: 'kurutma',
    title: 'Kurutma',
    icon: Wind,
    label: 'Form ve denge',
    summary: 'Kumaş hassasiyeti, form ve hedef nem dengesini birlikte ele alan kurutma yaklaşımı.',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1600&q=85',
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
