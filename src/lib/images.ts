// Imagens do funil — todas servidas por CDN público (sem assets binários no repo).
// - Fotos da estufa/produtos: CDN oficial da loja (Tray / tcdn).
// - Retratos das faixas etárias: Pexels (licença gratuita, hotlink permitido).

const TCDN = "https://images.tcdn.com.br";

function pexels(id: string, w = 600): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

export const IMG = {
  logo: `${TCDN}/files/660625/themes/91/img/settings/LOGOSEMFUNDOAQUI.png`,
  hero: `${TCDN}/img/img_prod/660625/kit_2_orquideas_cattleyas_adultas_edicao_especial_1410_1_7eeb8d0b5c6ce238f8567cade0393f34.jpg`,
  estufa1: `${TCDN}/img/img_prod/660625/10_mudas_de_orquideas_phalaenopsis_929_2_34ba48b3a25a73aaa493401b47a199ae.jpg`,
  estufa2: `${TCDN}/img/img_prod/660625/dendrobium_densiflorum_adulta_943_2_dde299cfe05ed8bf4be50f53c6bb6149.jpg`,
  estufa3: `${TCDN}/img/img_prod/660625/orquidea_cattleya_amenthystoglossa_jessica_adulta_1247_1_1744b3a4f4ebfd39b785728c99eb71a1.jpg`,
  kit10: `${TCDN}/img/img_prod/660625/kit_10_mudas_mix_especial_1092_2_3873530e26c20209f573507a840098fd.jpg`,
  age40: pexels("1996250"),
  age50: pexels("29405854"),
  age60: pexels("5638674"),
  age70: pexels("16218038"),
} as const;
