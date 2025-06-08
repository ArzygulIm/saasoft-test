<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useAccountStore, type Account } from "@/app/store/accounts";
import AccountItem from "@/components/AccountItem.vue";
import AccountForm from "@/components/AccountForm.vue";

const store = useAccountStore();
const showAddAccount = ref(false);

const accounts = ref<Account[]>([]);

onMounted(() => {
  store.loadFromStorage();
  accounts.value = [...store.accounts];
});

watch(
  () => store.accounts,
  (val) => {
    accounts.value = [...val];
    store.saveToStorage();
  },
  { deep: true }
);

function handleAdd(account: Account) {
  store.addAccount(account);
}

function handleDelete(id: string) {
  store.deleteAccount(id);
}
</script>

<template>
  <div class="accounts-container">
    <h2>Учетные записи</h2>
    <el-button type="primary" @click="showAddAccount = true">+ Добавить</el-button>

    <AccountItem
      v-for="account in accounts"
      :key="account.id"
      :account="account"
      @delete="handleDelete"
    />

    <AccountForm
      :visible="showAddAccount"
      @add="handleAdd"
      @close="showAddAccount = false"
    />
  </div>
</template>

<style scoped>
.accounts-container {
  padding: 20px;
}
</style>