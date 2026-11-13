<template>
  <section class="mail-signature">
    <div class="title">{{ t('mailSignature') }}</div>
    <el-form v-if="loaded" label-position="top" @submit.prevent="save">
      <el-switch v-model="form.enabled" :active-text="t('signatureAutomatic')" />
      <el-form-item :label="t('signatureName')"><el-input v-model="form.name" maxlength="120" /></el-form-item>
      <el-form-item :label="t('signatureTitle')"><el-input v-model="form.title" maxlength="120" /></el-form-item>
      <el-form-item :label="t('signaturePhone')"><el-input v-model="form.phone" maxlength="80" /></el-form-item>
      <el-form-item :label="t('signatureAddress')"><el-input v-model="form.address" type="textarea" maxlength="500" :rows="3" /></el-form-item>
      <el-button type="primary" :loading="saving" native-type="submit">{{ t('save') }}</el-button>
      <p>{{ t('signatureEmailHint') }}</p>
      <div class="signature-preview" v-html="preview" />
    </el-form>
    <el-button v-else :loading="loading" @click="load">{{ t('signatureLoad') }}</el-button>
  </section>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { getSignature, saveSignature } from '@/request/my.js';
import { useUserStore } from '@/store/user.js';
import { signatureHtml } from '@/utils/signature.js';

const { t } = useI18n();
const userStore = useUserStore();
const form = reactive({ enabled: false, name: '', title: '', phone: '', address: '' });
const loaded = ref(false);
const loading = ref(false);
const saving = ref(false);
const preview = computed(() => signatureHtml({ ...form, enabled: true }, userStore.user.email || '', window.location.origin));
async function load() {
  loading.value = true;
  try {
    Object.assign(form, await getSignature());
    loaded.value = true;
  } catch { /* The request interceptor displays the error. */ }
  finally { loading.value = false; }
}
async function save() {
  saving.value = true;
  try {
    const saved = await saveSignature({ ...form });
    userStore.user.signature = saved;
    ElMessage.success(t('saveSuccessMsg'));
  } catch { /* Keep edited fields available for retry. */ }
  finally { saving.value = false; }
}
onMounted(load);
</script>
<style scoped>
.mail-signature { margin-bottom:40px; max-width:680px; }
.title { font-size:18px; font-weight:bold; margin-bottom:20px; }
.el-switch { margin-bottom:20px; }
.signature-preview { padding:20px; background:#fff; border:1px solid #ddd; border-radius:6px; }
p { font-size:13px; color:var(--el-text-color-secondary); }
</style>
