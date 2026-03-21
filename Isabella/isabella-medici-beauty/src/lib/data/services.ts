export type Service = {
  id: string
  category: 'cilios' | 'sobrancelhas'
  name: { pt: string; en: string; es: string }
  description: { pt: string; en: string; es: string }
  price: number
  duration: number
  image: string
}

export const services: Service[] = [
  // CÍLIOS
  {
    id: 'lash-classic',
    category: 'cilios',
    name: { pt: 'Alongamento Clássico', en: 'Classic Extension', es: 'Extensión Clásica' },
    description: {
      pt: 'Fio a fio para um resultado natural e delicado.',
      en: 'Strand by strand for a natural and delicate result.',
      es: 'Pelo a pelo para un resultado natural y delicado.',
    },
    price: 180,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&q=80',
  },
  {
    id: 'lash-russian',
    category: 'cilios',
    name: { pt: 'Volume Russo', en: 'Russian Volume', es: 'Volumen Ruso' },
    description: {
      pt: 'Técnica de fios em leque para volume intenso e dramático.',
      en: 'Fan lash technique for intense and dramatic volume.',
      es: 'Técnica de abanico para un volumen intenso y dramático.',
    },
    price: 220,
    duration: 150,
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80',
  },
  {
    id: 'lash-mega',
    category: 'cilios',
    name: { pt: 'Mega Volume', en: 'Mega Volume', es: 'Mega Volumen' },
    description: {
      pt: 'Máximo volume com fios ultrafinos em alta densidade.',
      en: 'Maximum volume with ultra-thin high-density lashes.',
      es: 'Máximo volumen con hilos ultrafinos en alta densidad.',
    },
    price: 260,
    duration: 180,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
  },
  {
    id: 'lash-lifting',
    category: 'cilios',
    name: { pt: 'Lash Lifting + Botox', en: 'Lash Lifting + Botox', es: 'Lifting de Pestañas + Botox' },
    description: {
      pt: 'Curvatura e nutrição profunda para cílios naturais.',
      en: 'Curling and deep nourishment for natural lashes.',
      es: 'Curvatura y nutrición profunda para pestañas naturales.',
    },
    price: 150,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: 'lash-maintenance',
    category: 'cilios',
    name: { pt: 'Manutenção de Cílios', en: 'Lash Maintenance', es: 'Mantenimiento de Pestañas' },
    description: {
      pt: 'Reposição de fios para manter o visual impecável.',
      en: 'Lash refill to keep your look flawless.',
      es: 'Relleno de hilos para mantener el look impecable.',
    },
    price: 120,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
  },
  // SOBRANCELHAS
  {
    id: 'brow-design',
    category: 'sobrancelhas',
    name: { pt: 'Design de Sobrancelha', en: 'Brow Design', es: 'Diseño de Cejas' },
    description: {
      pt: 'Mapeamento e modelagem para sobrancelhas perfeitas.',
      en: 'Mapping and shaping for perfect brows.',
      es: 'Mapeo y modelado para cejas perfectas.',
    },
    price: 60,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  },
  {
    id: 'brow-henna',
    category: 'sobrancelhas',
    name: { pt: 'Henna de Sobrancelha', en: 'Brow Henna', es: 'Henna de Cejas' },
    description: {
      pt: 'Coloração natural com hena para sobrancelhas definidas.',
      en: 'Natural henna coloring for defined brows.',
      es: 'Coloración natural con henna para cejas definidas.',
    },
    price: 80,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
  {
    id: 'brow-micropigmentation',
    category: 'sobrancelhas',
    name: { pt: 'Micropigmentação', en: 'Microblading', es: 'Micropigmentación' },
    description: {
      pt: 'Técnica semipermanente para sobrancelhas naturais por até 2 anos.',
      en: 'Semi-permanent technique for natural brows lasting up to 2 years.',
      es: 'Técnica semipermanente para cejas naturales por hasta 2 años.',
    },
    price: 450,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
  },
  {
    id: 'brow-lamination',
    category: 'sobrancelhas',
    name: { pt: 'Brow Lamination', en: 'Brow Lamination', es: 'Laminado de Cejas' },
    description: {
      pt: 'Alinhamento e fixação dos fios para sobrancelhas volumosas.',
      en: 'Strand alignment and fixation for voluminous brows.',
      es: 'Alineación y fijación de los pelos para cejas voluminosas.',
    },
    price: 130,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1547895870-9064d1ef2dc3?w=600&q=80',
  },
  {
    id: 'brow-razor',
    category: 'sobrancelhas',
    name: { pt: 'Sobrancelha a Navalha', en: 'Razor Brow', es: 'Ceja a Navaja' },
    description: {
      pt: 'Acabamento preciso e definido com navalha profissional.',
      en: 'Precise and defined finish with a professional razor.',
      es: 'Acabado preciso y definido con navaja profesional.',
    },
    price: 70,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
  },
]
