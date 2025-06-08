<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Account } from "@/app/store/accounts";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add", account: Account): void;
}>();

const newAccount = ref<Partial<Account>>({
  type: "Локальная",
  login: "",
  password: "",
  labels: [],
});

const labelText = ref("");

watch(() => props.visible, (val) => {
  if (val) {
    newAccount.value = {
      type: "Локальная",
      login: "",
      password: "",
      labels: [],
    };
    labelText.value = "";
  }
});

watch(labelText, (val) => {
  newAccount.value.labels = val
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
});

function submit() {
  if (!newAccount.value.login || !newAccount.value.password) {
    return;
  }

  emit("add", {
    id: Date.now().toString(),
    type: newAccount.value.type!,
    login: newAccount.value.login!,
    password: newAccount.value.password!,
    labels: newAccount.value.labels || [],
    isValid: true,
  });
  emit("close");
}
</script>

<template>
  <el-dialog :model-value="visible" title="Добавить учетную запись" width="50%" @close="emit('close')">
    <el-form :model="newAccount" label-width="120px">
      <el-form-item label="Тип учетной записи">
        <el-select v-model="newAccount.type">
          <el-option label="LDAP" value="LDAP" />
          <el-option label="Локальная" value="Локальная" />
        </el-select>
      </el-form-item>

      <el-form-item label="Метки">
        <el-input v-model="labelText" />
      </el-form-item>

      <el-form-item label="Логин" required>
        <el-input v-model="newAccount.login" />
      </el-form-item>

      <el-form-item v-if="newAccount.type === 'Локальная'" label="Пароль" required>
        <el-input v-model="newAccount.password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">Отмена</el-button>
      <el-button type="primary" @click="submit">Сохранить</el-button>
    </template>
  </el-dialog>
</template>