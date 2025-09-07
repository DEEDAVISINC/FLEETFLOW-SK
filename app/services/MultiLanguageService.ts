/**
 * Multi-Language Service for DEPOINTE AI
 * Inspired by Sintra.ai's 100+ language support
 * Specialized for freight brokerage communications
 */

'use client';

export type SupportedLanguage =
  | 'en'
  | 'es'
  | 'fr'
  | 'zh'
  | 'pt'
  | 'de'
  | 'it'
  | 'ja'
  | 'ko'
  | 'ru';

export interface Translation {
  [key: string]: string;
}

export interface FreightTranslations {
  [language: string]: {
    // Common freight terms
    freight: string;
    carrier: string;
    shipper: string;
    broker: string;
    load: string;
    delivery: string;
    pickup: string;
    rate: string;
    quote: string;

    // Communication templates
    greeting: string;
    followUp: string;
    rateConfirmation: string;
    deliveryUpdate: string;
    emergencyContact: string;

    // Business terms
    contract: string;
    invoice: string;
    payment: string;
    insurance: string;
    compliance: string;

    // Status updates
    inTransit: string;
    delivered: string;
    delayed: string;
    cancelled: string;

    // AI staff introductions
    aiStaffIntro: string;
    humanLikeGreeting: string;

    // Common FleetFlow UI terms
    dashboard: string;
    navigation: string;
    settings: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
    home: string;
    about: string;
    contact: string;
    help: string;
    search: string;
    notifications: string;
    messages: string;
    tasks: string;
    reports: string;
    analytics: string;
    users: string;
    roles: string;
    permissions: string;

    // Navigation specific terms
    operations: string;
    dispatch: string;
    drivers: string;
    fleet: string;
    compliance: string;
    resources: string;
    admin: string;
  };
}

export class MultiLanguageService {
  private currentLanguage: SupportedLanguage = 'en';

  private translations: FreightTranslations = {
    en: {
      // English (Default)
      freight: 'freight',
      carrier: 'carrier',
      shipper: 'shipper',
      broker: 'broker',
      load: 'load',
      delivery: 'delivery',
      pickup: 'pickup',
      rate: 'rate',
      quote: 'quote',
      greeting: "Hello! I hope you're having a great day.",
      followUp:
        'I wanted to follow up on our previous conversation about your shipping needs.',
      rateConfirmation: "I'm pleased to confirm your rate for this shipment.",
      deliveryUpdate: 'I have an update on your delivery status.',
      emergencyContact:
        'This is regarding an urgent matter with your shipment.',
      contract: 'contract',
      invoice: 'invoice',
      payment: 'payment',
      insurance: 'insurance',
      compliance: 'compliance',
      inTransit: 'in transit',
      delivered: 'delivered',
      delayed: 'delayed',
      cancelled: 'cancelled',
      aiStaffIntro:
        "Hi, this is {name} from DEPOINTE AI. I'm here to help with your freight needs.",
      humanLikeGreeting:
        "Good {timeOfDay}! I hope I'm catching you at a good time.",
      // FleetFlow UI terms
      dashboard: 'Dashboard',
      navigation: 'Navigation',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      help: 'Help',
      search: 'Search',
      notifications: 'Notifications',
      messages: 'Messages',
      tasks: 'Tasks',
      reports: 'Reports',
      analytics: 'Analytics',
      users: 'Users',
      roles: 'Roles',
      permissions: 'Permissions',

      // Navigation specific terms
      operations: 'Operations',
      dispatch: 'Dispatch',
      drivers: 'Drivers',
      fleet: 'Fleet',
      compliance: 'Compliance',
      resources: 'Resources',
      admin: 'Admin',
    },
    es: {
      // Spanish - Major freight corridors (Mexico, Southwest US)
      freight: 'carga',
      carrier: 'transportista',
      shipper: 'embarcador',
      broker: 'corredor',
      load: 'cargamento',
      delivery: 'entrega',
      pickup: 'recogida',
      rate: 'tarifa',
      quote: 'cotización',
      greeting: '¡Hola! Espero que esté teniendo un excelente día.',
      followUp:
        'Quería hacer seguimiento a nuestra conversación anterior sobre sus necesidades de envío.',
      rateConfirmation: 'Me complace confirmar su tarifa para este envío.',
      deliveryUpdate: 'Tengo una actualización sobre el estado de su entrega.',
      emergencyContact: 'Esto es sobre un asunto urgente con su envío.',
      contract: 'contrato',
      invoice: 'factura',
      payment: 'pago',
      insurance: 'seguro',
      compliance: 'cumplimiento',
      inTransit: 'en tránsito',
      delivered: 'entregado',
      delayed: 'retrasado',
      cancelled: 'cancelado',
      aiStaffIntro:
        'Hola, soy {name} de DEPOINTE AI. Estoy aquí para ayudarle con sus necesidades de carga.',
      humanLikeGreeting:
        '¡Buenos {timeOfDay}! Espero no interrumpir en mal momento.',
      // FleetFlow UI terms (Spanish)
      dashboard: 'Panel de Control',
      navigation: 'Navegación',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      home: 'Inicio',
      about: 'Acerca de',
      contact: 'Contacto',
      help: 'Ayuda',
      search: 'Buscar',
      notifications: 'Notificaciones',
      messages: 'Mensajes',
      tasks: 'Tareas',
      reports: 'Reportes',
      analytics: 'Análisis',
      users: 'Usuarios',
      roles: 'Roles',
      permissions: 'Permisos',
    },
    fr: {
      // French - Canadian operations
      freight: 'fret',
      carrier: 'transporteur',
      shipper: 'expéditeur',
      broker: 'courtier',
      load: 'chargement',
      delivery: 'livraison',
      pickup: 'ramassage',
      rate: 'tarif',
      quote: 'devis',
      greeting: "Bonjour! J'espère que vous passez une excellente journée.",
      followUp:
        "Je voulais faire le suivi de notre conversation précédente concernant vos besoins d'expédition.",
      rateConfirmation:
        "J'ai le plaisir de confirmer votre tarif pour cet envoi.",
      deliveryUpdate: "J'ai une mise à jour sur le statut de votre livraison.",
      emergencyContact: 'Ceci concerne une question urgente avec votre envoi.',
      contract: 'contrat',
      invoice: 'facture',
      payment: 'paiement',
      insurance: 'assurance',
      compliance: 'conformité',
      inTransit: 'en transit',
      delivered: 'livré',
      delayed: 'retardé',
      cancelled: 'annulé',
      aiStaffIntro:
        'Bonjour, je suis {name} de DEPOINTE AI. Je suis là pour vous aider avec vos besoins de fret.',
      humanLikeGreeting:
        "Bon{timeOfDay}! J'espère que je vous contacte au bon moment.",
      // FleetFlow UI terms (French)
      dashboard: 'Tableau de Bord',
      navigation: 'Navigation',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: "S'inscrire",
      home: 'Accueil',
      about: 'À Propos',
      contact: 'Contact',
      help: 'Aide',
      search: 'Rechercher',
      notifications: 'Notifications',
      messages: 'Messages',
      tasks: 'Tâches',
      reports: 'Rapports',
      analytics: 'Analyses',
      users: 'Utilisateurs',
      roles: 'Rôles',
      permissions: 'Permissions',
    },
    zh: {
      // Mandarin - Asian trade lanes
      freight: '货运',
      carrier: '承运商',
      shipper: '发货人',
      broker: '经纪人',
      load: '货物',
      delivery: '交付',
      pickup: '提货',
      rate: '费率',
      quote: '报价',
      greeting: '您好！希望您今天过得愉快。',
      followUp: '我想跟进我们之前关于您运输需求的对话。',
      rateConfirmation: '我很高兴确认您此次货运的费率。',
      deliveryUpdate: '我有您的交付状态更新。',
      emergencyContact: '这是关于您货运的紧急事项。',
      contract: '合同',
      invoice: '发票',
      payment: '付款',
      insurance: '保险',
      compliance: '合规',
      inTransit: '运输中',
      delivered: '已交付',
      delayed: '延迟',
      cancelled: '已取消',
      aiStaffIntro:
        '您好，我是DEPOINTE AI的{name}。我在这里帮助您处理货运需求。',
      humanLikeGreeting: '{timeOfDay}好！希望我联系您的时间合适。',
      // FleetFlow UI terms (Mandarin)
      dashboard: '仪表板',
      navigation: '导航',
      settings: '设置',
      profile: '个人资料',
      logout: '登出',
      login: '登录',
      register: '注册',
      home: '首页',
      about: '关于',
      contact: '联系我们',
      help: '帮助',
      search: '搜索',
      notifications: '通知',
      messages: '消息',
      tasks: '任务',
      reports: '报告',
      analytics: '分析',
      users: '用户',
      roles: '角色',
      permissions: '权限',
    },
    pt: {
      // Portuguese - Brazilian operations
      freight: 'frete',
      carrier: 'transportadora',
      shipper: 'embarcador',
      broker: 'corretor',
      load: 'carga',
      delivery: 'entrega',
      pickup: 'coleta',
      rate: 'taxa',
      quote: 'cotação',
      greeting: 'Olá! Espero que esteja tendo um ótimo dia.',
      followUp:
        'Gostaria de dar seguimento à nossa conversa anterior sobre suas necessidades de transporte.',
      rateConfirmation:
        'Tenho o prazer de confirmar sua taxa para este embarque.',
      deliveryUpdate: 'Tenho uma atualização sobre o status da sua entrega.',
      emergencyContact: 'Isto é sobre um assunto urgente com seu embarque.',
      contract: 'contrato',
      invoice: 'fatura',
      payment: 'pagamento',
      insurance: 'seguro',
      compliance: 'conformidade',
      inTransit: 'em trânsito',
      delivered: 'entregue',
      delayed: 'atrasado',
      cancelled: 'cancelado',
      aiStaffIntro:
        'Olá, sou {name} da DEPOINTE AI. Estou aqui para ajudar com suas necessidades de frete.',
      humanLikeGreeting:
        'Bom {timeOfDay}! Espero estar entrando em contato em um bom momento.',
      // FleetFlow UI terms (Portuguese)
      dashboard: 'Painel de Controle',
      navigation: 'Navegação',
      settings: 'Configurações',
      profile: 'Perfil',
      logout: 'Sair',
      login: 'Entrar',
      register: 'Cadastrar',
      home: 'Início',
      about: 'Sobre',
      contact: 'Contato',
      help: 'Ajuda',
      search: 'Buscar',
      notifications: 'Notificações',
      messages: 'Mensagens',
      tasks: 'Tarefas',
      reports: 'Relatórios',
      analytics: 'Análises',
      users: 'Usuários',
      roles: 'Funções',
      permissions: 'Permissões',
    },
  };

  /**
   * Set the current language
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Get translation for a key
   */
  translate(key: string, variables?: Record<string, string>): string {
    const translation =
      this.translations[this.currentLanguage]?.[key] ||
      this.translations['en'][key] ||
      key;

    if (!variables) return translation;

    // Replace variables in the format {variableName}
    return Object.entries(variables).reduce((text, [key, value]) => {
      return text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }, translation);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): {
    code: SupportedLanguage;
    name: string;
    flag: string;
  }[] {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'pt', name: 'Português', flag: '🇧🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ];
  }

  /**
   * Generate personalized greeting based on time and language
   */
  generateGreeting(
    staffName: string,
    timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning'
  ): string {
    const timeTranslations = {
      en: { morning: 'morning', afternoon: 'afternoon', evening: 'evening' },
      es: { morning: 'días', afternoon: 'tardes', evening: 'noches' },
      fr: { morning: 'jour', afternoon: 'après-midi', evening: 'soir' },
      zh: { morning: '上午', afternoon: '下午', evening: '晚上' },
      pt: { morning: 'dia', afternoon: 'tarde', evening: 'noite' },
    };

    const timeText =
      timeTranslations[this.currentLanguage]?.[timeOfDay] || timeOfDay;

    return (
      this.translate('humanLikeGreeting', { timeOfDay: timeText }) +
      ' ' +
      this.translate('aiStaffIntro', { name: staffName })
    );
  }

  /**
   * Generate freight-specific email template
   */
  generateEmailTemplate(
    type: 'quote' | 'followup' | 'delivery' | 'emergency',
    context: any = {}
  ): string {
    const templates = {
      quote: `${this.translate('greeting')}

${this.translate('rateConfirmation')} ${context.rate || '[RATE]'} ${context.lane || '[LANE]'}.

${context.details || 'Please let me know if you have any questions.'}

Best regards,
${context.staffName || '[STAFF_NAME]'}
DEPOINTE AI`,

      followup: `${this.translate('greeting')}

${this.translate('followUp')}

${context.message || 'I wanted to check if you have any upcoming shipping needs we can help with.'}

Best regards,
${context.staffName || '[STAFF_NAME]'}
DEPOINTE AI`,

      delivery: `${this.translate('greeting')}

${this.translate('deliveryUpdate')}

Status: ${this.translate(context.status || 'inTransit')}
${context.details || ''}

Best regards,
${context.staffName || '[STAFF_NAME]'}
DEPOINTE AI`,

      emergency: `${this.translate('emergencyContact')}

${context.message || 'Please contact us immediately regarding your shipment.'}

Urgent Contact: ${context.phone || '+1-833-386-3509'}

${context.staffName || '[STAFF_NAME]'}
DEPOINTE AI`,
    };

    return templates[type] || templates.quote;
  }

  /**
   * Detect language from text (basic implementation)
   */
  detectLanguage(text: string): SupportedLanguage {
    // Simple language detection based on common words/characters
    if (/[一-龯]/.test(text)) return 'zh'; // Chinese characters
    if (/[а-яё]/i.test(text)) return 'ru'; // Cyrillic
    if (/[ひらがなカタカナ]/.test(text)) return 'ja'; // Japanese
    if (/[가-힣]/.test(text)) return 'ko'; // Korean

    // Check for common Spanish words
    if (/(hola|gracias|por favor|buenos días)/i.test(text)) return 'es';

    // Check for common French words
    if (/(bonjour|merci|s'il vous plaît|bonne journée)/i.test(text))
      return 'fr';

    // Check for common Portuguese words
    if (/(olá|obrigado|por favor|bom dia)/i.test(text)) return 'pt';

    return 'en'; // Default to English
  }

  /**
   * Get freight terminology in current language
   */
  getFreightTerms(): Record<string, string> {
    const currentTranslations =
      this.translations[this.currentLanguage] || this.translations['en'];

    return {
      freight: currentTranslations.freight,
      carrier: currentTranslations.carrier,
      shipper: currentTranslations.shipper,
      broker: currentTranslations.broker,
      load: currentTranslations.load,
      delivery: currentTranslations.delivery,
      pickup: currentTranslations.pickup,
      rate: currentTranslations.rate,
      quote: currentTranslations.quote,
    };
  }

  /**
   * Format currency based on language/region
   */
  formatCurrency(amount: number): string {
    const formatters = {
      en: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      es: new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
      }),
      fr: new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
      }),
      zh: new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
      }),
      pt: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    };

    const formatter = formatters[this.currentLanguage] || formatters['en'];
    return formatter.format(amount);
  }

  /**
   * Get language-specific communication preferences
   */
  getCommunicationStyle(language: SupportedLanguage): {
    formality: 'formal' | 'casual';
    directness: 'direct' | 'indirect';
    preferredGreeting: string;
  } {
    const styles = {
      en: {
        formality: 'casual',
        directness: 'direct',
        preferredGreeting: 'Hi',
      },
      es: {
        formality: 'formal',
        directness: 'indirect',
        preferredGreeting: 'Buenos días',
      },
      fr: {
        formality: 'formal',
        directness: 'indirect',
        preferredGreeting: 'Bonjour',
      },
      zh: {
        formality: 'formal',
        directness: 'indirect',
        preferredGreeting: '您好',
      },
      pt: {
        formality: 'casual',
        directness: 'direct',
        preferredGreeting: 'Olá',
      },
    };

    return styles[language] || styles['en'];
  }
}

// Export singleton instance
export const multiLanguageService = new MultiLanguageService();
