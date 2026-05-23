<template>
  <div class="theme-dropdown">
    <button
      class="theme-btn"
      ref="dropdownButton"
      aria-label="Theme Select Button"
      @click="openThemeList = !openThemeList"
    >
      <span class="fa fa-circle-half-stroke"></span>
    </button>
    <div
      :class="`dropdown ${openThemeList ? 'showList' : ''}`"
      ref="dropdownList"
    >
      <ul class="dropdown-list" role="menu">
        <li
          role="menuitem"
          class="dropdown-items theme-items"
          :ref="setThemesRef"
          @click="setTheme('Auto')"
        >
          <span class="theme-text">Auto</span>
          <span class="check-icon fa fa-check"></span>
        </li>
        <li
          class="dropdown-items theme-items"
          :ref="setThemesRef"
          role="menuitem"
          @click="setTheme('Light')"
        >
          <span class="theme-text">Light</span
          ><span class="check-icon fa fa-check"></span>
        </li>
        <li
          class="dropdown-items theme-items"
          :ref="setThemesRef"
          role="menuitem"
          @click="setTheme('Dark')"
        >
          <span class="theme-text">Dark</span
          ><span class="check-icon fa fa-check"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from "vue";

let themeSetting = localStorage.getItem("themeSetting") || "Auto";
type ElementType = HTMLElement;

const themeItems = ref<ElementType[]>([]);

const dropdownList = ref<ElementType>();
const openThemeList = ref(false);

const dropdownButton = ref<ElementType>();
function setThemesRef(el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLElement) {
    themeItems.value.push(el);
  }
}

function setTheme(theme: string) {
  themeSetting = theme;
  themeItems.value.forEach((themeSetting) => {
    themeSetting.classList.remove("active");
    if (themeSetting.textContent.includes(theme)) {
      themeSetting.classList.add("active");
    }
  });
  if (themeSetting == "Dark") {
    if (document.body.classList.contains("light")) {
      document.body.classList.replace("light", "dark");
    } else {
      document.body.classList.add("dark");
    }
  } else if (themeSetting == "Light") {
    if (document.body.classList.contains("dark")) {
      document.body.classList.replace("dark", "light");
    } else {
      document.body.classList.add("light");
    }
  } else if (themeSetting == "Auto") {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
  }

  localStorage.setItem("themeSetting", themeSetting);
  dropdownList.value?.classList.remove("showList");
}
function handleClickOutside(e: Event) {
  const target = e.target as Node | null;
  if (
    dropdownList.value &&
    !dropdownList.value.contains(target) &&
    !dropdownButton.value?.contains(target)
  ) {
    openThemeList.value = false;
  }
}

onMounted(() => {
  setTheme(themeSetting);
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  localStorage.setItem("themeSetting", themeSetting);

  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
div.theme-dropdown {
  display: inline-flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  width: fit-content;
  z-index: 2;
  padding-block: 0;
}

.theme-btn {
  border: none;
  width: 100%;
  width: 75px;
  background: var(--card-bg);
  color: var(--text);
}
.theme-btn::after {
  display: inline-block;
  margin-left: 0.5em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.theme-dropdown .dropdown {
  width: max-content;
  padding-block: 0.75rem;
  font-weight: 400;
  --border-radius-default: 5px;
  border-radius: var(--border-radius-default);
  --size-value-small: 0.15rem;
  margin-top: var(--size-value-small);
  display: none;
  background: var(--card-bg);
  color: var(--text);
}

.theme-dropdown .dropdown.showList {
  display: block;
}

.theme-dropdown .dropdown .dropdown-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: Poppins;
}

.dropdown-list .dropdown-items.theme-items {
  width: 100%;
  padding: 0.35rem var(--size-value-big);
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3em;
}

.dropdown-list .dropdown-items.theme-items:is(.active, :active, :hover) {
  background: var(--color-blue);
  color: whitesmoke;
}

.dropdown-list .dropdown-items.theme-items span.check-icon {
  display: none;
}

.dropdown-list .dropdown-items.theme-items.active span.check-icon {
  display: initial;
}
</style>
