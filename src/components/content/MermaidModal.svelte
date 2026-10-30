<script lang="ts">
  import XMarkIcon from "#components/icon/XMark.svelte";
  import MermaidViewer from "./MermaidViewer.svelte";

  interface Props {
    code: string;
    open?: boolean;
  }

  let { code, open = $bindable(false) }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });
</script>

<dialog
  bind:this={dialog}
  aria-label="Mermaid 다이어그램 보기"
  data-testid="mermaid-modal"
  class="modal"
  onclose={() => (open = false)}
>
  <div
    class="modal-box bg-base-100 border-base-300 relative flex h-[85vh] w-11/12 max-w-7xl flex-col overflow-hidden border p-0"
  >
    <div class="absolute top-3 right-3 z-20">
      <button
        type="button"
        class="btn btn-circle btn-ghost btn-sm"
        aria-label="닫기"
        title="닫기"
        onclick={() => (open = false)}
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    {#if open}
      <MermaidViewer
        {code}
        expandable={false}
        wheelModifier={null}
        class="my-0 h-full border-0"
      />
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button aria-label="모달 배경 닫기">닫기</button>
  </form>
</dialog>
