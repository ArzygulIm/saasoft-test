<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { Account } from "@/app/store/accounts";
import { useAccountStore } from "@/app/store/accounts";

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  (e: "delete", id: string): void;
}>();

const store = useAccountStore();
const labelText = ref(props.account.labels?.map(l => l.text).join("; ") || "");

watch(labelText, (val) => {
  props.account.labels = val
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
  store.updateAccount(props.account);
});

function validate() {
  const isLoginValid =
    props.account.login.trim().length > 0 && props.account.login.length <= 100;
  const isPasswordValid =
    props.account.type === "Локальная"
      ? props.account.password?.length > 0 && props.account.password.length <= 100
      : true;

  props.account.isValid = isLoginValid && isPasswordValid;
  store.updateAccount(props.account);

  if (!props.account.isValid) {
    ElMessage.error("Ошибка валидации. Проверьте поля.");
  }

  return props.account.isValid;
}
</script>

<template>
  <el-form :model="props.account" :inline="true" class="account-entry">
    <el-form-item>
      <el-input v-model="labelText" placeholder="Метки (через ;)" />
    </el-form-item>

    <el-form-item>
      <el-select v-model="props.account.type" @change="validate">
        <el-option label="LDAP" value="LDAP" />
        <el-option label="Локальная" value="Локальная" />
      </el-select>
    </el-form-item>

    <el-form-item :class="{ 'is-error': !props.account.isValid }">
      <el-input v-model="props.account.login" placeholder="Логин" @blur="validate" />
    </el-form-item>

    <el-form-item
      v-if="props.account.type === 'Локальная'"
      :class="{ 'is-error': !props.account.isValid }"
    >
      <el-input
        v-model="props.account.password"
        placeholder="Пароль"
        show-password
        @blur="validate"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="danger" @click="emit('delete', props.account.id)">Удалить</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.account-entry {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}
.is-error :deep(.el-input__inner) {
  border-color: #f56c6c;
}
</style>